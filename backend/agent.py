from typing import List
from pydantic import BaseModel, Field
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain_community.tools import DuckDuckGoSearchResults

llm = ChatOpenAI(model="gpt-5-nano")
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

vector_store = Chroma(
    collection_name="esg_reports",
    persist_directory="./chroma_db",
    embedding_function=embeddings,
)


class ThemesResponse(BaseModel):
    themes: List[str] = Field(
        ..., description="Top ESG themes identified in the report"
    )


class Claim(BaseModel):
    text: str = Field(..., description="The ESG claim")
    reference: str = Field(..., description="The source of the claim")


class ClaimsResponse(BaseModel):
    claims: List[Claim] = Field(
        ..., description="A list of extracted ESG claims with references"
    )


class SearchQueriesResponse(BaseModel):
    queries: List[str] = Field(..., description="Search queries for each claim")


class ClaimVerdict(BaseModel):
    claim: str
    synthesis: str
    status: str


class FinalAssessment(BaseModel):
    greenwash_score: int
    summary: str


class State(TypedDict):
    company_name: str
    retrieved_docs: list | None
    context: str | None
    themes: list | None
    claims: list | None
    search_queries: list | None
    evidence: list | None
    final_report: list[ClaimVerdict] | None
    final_assessment: FinalAssessment | None


def retrieve_docs(state: State) -> State:
    print(f"[Step] LLM-guided retrieval for: {state['company_name']}")

    prompt = f"""
You are an ESG analyst. Based on the company {state['company_name']}'s sustainability report in our database, 
suggest **5–7 focused keywords, topics, or phrases** most likely to contain measurable, verifiable ESG claims. 
Return them as a simple bullet list.
"""
    structured_llm = llm.with_structured_output(SearchQueriesResponse)
    structured_output = structured_llm.invoke(prompt)
    suggested_topics = structured_output.model_dump().get("queries", [])

    print(f"[Info] LLM suggested topics: {suggested_topics}")

    all_docs = []
    for topic in suggested_topics:
        docs = vector_store.similarity_search(topic, k=5)
        all_docs.extend(docs)

    unique_docs = {doc.page_content: doc for doc in all_docs}.values()
    print(f"[Info] Retrieved {len(unique_docs)} unique documents")

    return {**state, "retrieved_docs": list(unique_docs)}


def prepare_context(state: State) -> State:
    print("[Step] Preparing context from LLM-filtered docs")

    docs = state.get("retrieved_docs", [])
    if not docs:
        print("[Warning] No docs retrieved. Context will be empty.")
        return {**state, "context": ""}

    docs_text = "\n\n".join(
        [
            f"[Source: {doc.metadata.get('source', 'unknown')}, Page: {doc.metadata.get('page', 'N/A')}]\n{doc.page_content}"
            for doc in docs
        ]
    )

    prompt = f"""
You are an ESG analyst. Summarize and extract the **most relevant excerpts** from the following document chunks that
are likely to contain measurable, verifiable ESG claims for {state['company_name']}.  

Document Chunks:
{docs_text}

Instructions:
1. Only keep the parts likely to contain specific ESG claims or data.
2. Remove generic marketing text or vague statements.
3. Provide the summarized context in a single text block.
"""
    structured_llm = llm.with_structured_output(ThemesResponse)
    structured_output = structured_llm.invoke(prompt)
    summarized_context = "\n".join(structured_output.model_dump().get("themes", []))

    return {**state, "context": summarized_context}


def largest_themes(state: State) -> State:
    print("[Step] Extracting largest ESG themes")
    context = state.get("context") or ""
    prompt = f"""
You are an ESG analyst. Based on the {state['company_name']} sustainability report excerpts below, 
identify the **top 5 largest ESG themes or issues** discussed in the report.  

Report:
{context}
"""
    model_with_structure = llm.with_structured_output(ThemesResponse)
    structured_output = model_with_structure.invoke(prompt)
    themes_list = structured_output.model_dump().get("themes", [])
    print(f"[Info] Identified themes: {themes_list}")
    return {**state, "themes": themes_list}


def extract_claims(state: State) -> State:
    print("[Step] Extracting ESG claims")
    context = state.get("context") or ""
    prompt = f"""
You are an investigative ESG analyst. From the {state['company_name']} sustainability report excerpts:

1. Extract the **top 5 specific, measurable, and verifiable ESG claims (e.g. goals or initiatives)**.
2. Ignore generic statements or marketing language.
3. Include:
   - Exact claim text
   - Page or section reference
   - Any numbers, goals, or measurable metrics
4. Only focus on claims related to these ESG themes: {', '.join(state.get('themes', []))}

Report:
{context}
"""
    model_with_structure = llm.with_structured_output(ClaimsResponse)
    structured_output = model_with_structure.invoke(prompt)
    claims = structured_output.model_dump().get("claims", [])
    print(f"[Info] Extracted {len(claims)} claims")
    return {**state, "claims": claims}


def generate_search_queries(state: State) -> State:
    print("[Step] Generating search queries for claims using LLM")
    claims = state.get("claims") or []

    if not claims:
        print("[Warning] No claims found. Skipping search query generation.")
        return {**state, "search_queries": []}

    claims_text = "\n".join([f"- {claim['text']}" for claim in claims])
    prompt = f"""
You are an ESG research assistant. Convert the following ESG claims into **concise web search queries** that are likely to retrieve official reports, audits, or authoritative ESG sources.  

Claims:
{claims_text}

Instructions:
1. Focus on measurable programs, targets, or initiatives.
2. Include the company name if relevant.
3. Prefer **independent, authoritative sources**, such as:
   - site:sbt.org OR site:cdp.net OR site:un.org OR site:sciencebasedtargets.org OR official NGO or ESG reports.
4. **Explicitly exclude the company's own website or subsidiaries.**
   For example, use `-site:{state['company_name'].lower()}.com` or `-site:{state['company_name'].lower()}.co` to filter out self-published pages.
5. Avoid quoting the entire claim; pick key metrics or nouns.
6. Include optional keywords like "verification", "ESG audit", "report", "criticism", or "controversy".
7. Return a **list of search queries**, one per claim, in the same order.
"""
    structured_llm = llm.with_structured_output(SearchQueriesResponse)
    structured_output = structured_llm.invoke(prompt)
    queries = structured_output.model_dump().get("queries", [])

    print(f"[Info] Generated {queries} search queries")
    return {**state, "search_queries": queries}


def retrieve_evidence(state: State) -> State:
    print("[Step] Retrieving evidence from web")
    queries = state.get("search_queries") or []
    collected_evidence = []
    search_tool = DuckDuckGoSearchResults(output_format="list")

    for claim, query in zip(state.get("claims", []), queries):
        print(f"[Info] Searching for claim: {claim['text']}")
        try:
            results = search_tool.invoke(query, k=10)
            for result in results:
                collected_evidence.append(
                    {
                        "claim_text": claim["text"],
                        "snippet": result.get("snippet", ""),
                        "source": result.get("link", ""),
                        "weight": 3 if "report" in result.get("link", "") else 2,
                    }
                )
        except Exception as e:
            print(
                f"[Warning] Failed to retrieve evidence for claim: {claim['text'][:50]}... Error: {e}"
            )
            collected_evidence.append(
                {
                    "claim_text": claim["text"],
                    "snippet": "",
                    "source": "",
                    "weight": 0,
                    "note": f"Evidence retrieval failed: {e}",
                }
            )

    print(f"[Info] Collected {len(collected_evidence)} evidence items")
    return {**state, "evidence": collected_evidence}


def synthesize_findings(state: State) -> State:
    print("[Step] Synthesizing findings and verifying claims")
    claims = state.get("claims", [])
    all_evidence = state.get("evidence", [])

    structured_llm = llm.with_structured_output(ClaimVerdict)
    final_report = []

    for claim in claims:
        claim_text = claim["text"]

        relevant_evidence = [
            f"[Source: {ev['source']}]\n{ev['snippet']}"
            for ev in all_evidence
            if ev["claim_text"] == claim_text
        ]

        if not relevant_evidence:
            verdict = ClaimVerdict(
                claim=claim_text,
                synthesis="No external evidence was retrieved to support or contradict this claim.",
                status="Unsubstantiated",
            )
            final_report.append(verdict.model_dump())
            continue

        evidence_str = "\n\n".join(relevant_evidence)

        prompt = f"""
You are an investigative ESG journalist. Analyze the following ESG claim from a company's report against the external evidence provided.  

Company Claim:
"{claim_text}"

External Evidence:
{evidence_str}

Instructions:
1. Evaluate the credibility and relevance of each source (official reports > news > blogs).
2. Provide a **brief synthesis (2–3 sentences)** explaining your reasoning.
3. Give a **one-word verdict** from the following:  
   - Verified (evidence directly supports or does not contradict the claim)
   - Contradicted (evidence directly contradicts the claim)
   - Unsubstantiated (evidence is irrelevant, insufficient, or does not clearly support or contradict the claim)
4. If evidence is partial or incomplete, clearly state which aspects are supported or unclear.
"""
        try:
            verdict = structured_llm.invoke(prompt)
            final_report.append(verdict.model_dump())
        except Exception as e:
            verdict = ClaimVerdict(
                claim=claim_text,
                synthesis=f"Error during analysis: {e}",
                status="Error",
            )
            final_report.append(verdict.model_dump())

    return {**state, "final_report": final_report}


def generate_final_assessment(state: State) -> State:
    print("[Step] Generating final greenwash score and assessment")
    final_report = state.get("final_report", [])

    if not final_report:
        return state

    contradicted_count = sum(1 for r in final_report if r["status"] == "Contradicted")
    unsubstantiated_count = sum(
        1 for r in final_report if r["status"] == "Unsubstantiated"
    )
    total = len(final_report)

    score = min(
        10, round(10 * (contradicted_count * 1.2 + unsubstantiated_count * 0.5) / total)
    )

    print(f"[Info] Preliminary greenwash score: {score}/10")

    report_summary = "\n".join(
        [
            f"- Claim: \"{item['claim'][:100]}...\"\n  - Verdict: {item['status']}\n  - Analysis: {item['synthesis']}"
            for item in final_report
        ]
    )
    prompt = f"""
You are a senior ESG auditor. Based on the following analysis of {state['company_name']}'s sustainability claims and a final "Greenwash Score" (0–10), provide a concise, evidence-based summary.

Greenwash Score:
{score}/10

Claim Analysis Summary:
{report_summary}

Instructions:
1. Consider both the quantity and severity of unsupported claims. 
   A few unsubstantiated claims should indicate limited transparency, not major misconduct.
2. Focus on evidence quality, disclosure completeness, and alignment between stated goals and verified data.
3. Avoid harsh language or assumptions about intent—maintain a neutral, professional tone.
4. Provide a short 2–3 sentence summary explaining how the evidence (or lack thereof) shaped the score.
   Use phrasing that reflects proportional concern (e.g., "low concern," "moderate concern," "noticeable concern," "high concern").
"""
    try:
        assessment_llm = llm.with_structured_output(FinalAssessment)
        assessment = assessment_llm.invoke(prompt)
        return {**state, "final_assessment": assessment.model_dump()}
    except Exception as e:
        return {
            **state,
            "final_assessment": {"greenwash_score": score, "summary": f"Error: {e}"},
        }


workflow = StateGraph(State)
workflow.add_node("retrieve_docs", retrieve_docs)
workflow.add_node("prepare_context", prepare_context)
workflow.add_node("largest_themes", largest_themes)
workflow.add_node("extract_claims", extract_claims)
workflow.add_node("generate_search_queries", generate_search_queries)
workflow.add_node("retrieve_evidence", retrieve_evidence)
workflow.add_node("synthesize_findings", synthesize_findings)
workflow.add_node("generate_final_assessment", generate_final_assessment)

workflow.add_edge(START, "retrieve_docs")
workflow.add_edge("retrieve_docs", "prepare_context")
workflow.add_edge("prepare_context", "largest_themes")
workflow.add_edge("largest_themes", "extract_claims")
workflow.add_edge("extract_claims", "generate_search_queries")
workflow.add_edge("generate_search_queries", "retrieve_evidence")
workflow.add_edge("retrieve_evidence", "synthesize_findings")
workflow.add_edge("synthesize_findings", "generate_final_assessment")
workflow.add_edge("generate_final_assessment", END)

agent = workflow.compile()
