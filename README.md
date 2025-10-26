# Greenwatch: AI-Powered ESG Claim Verification

## Overview

Greenwatch is an AI system that automatically verifies corporate sustainability and ESG (Environmental, Social, and Governance) claims. It reads company sustainability reports, identifies measurable claims, cross-checks them against independent sources, and produces a structured transparency assessment and â€œgreenwash score.â€

The goal is to help investors, regulators, journalists, and consumers evaluate the credibility of corporate sustainability statements.

---

## Problem Statement

Corporations often make broad sustainability claims in their reports, such as 100% renewable energy or net-zero by 2030.
However, these reports are usually lengthy, complex, and full of non-verifiable marketing language.
Determining whether claims are fact-based or examples of greenwashing requires extensive manual investigation.

Greenwatch automates this process using a structured LLM workflow to extract, verify, and score ESG claims.

---

<img width="1600" height="787" alt="image" src="https://github.com/user-attachments/assets/4b1e7c29-dddd-40b1-aab4-bd8f9d893357" />

## How It Works

### 1. Document Retrieval
The system uses a vector database (Chroma) with OpenAI embeddings to retrieve the most relevant excerpts from a company's sustainability report.

### 2. Theme Identification
An LLM identifies the top ESG themes present in the report, such as carbon emissions, labor practices, supply chain transparency, or packaging waste.

### 3. Claim Extraction
The model extracts specific, measurable ESG claims tied to those themes (e.g., quantitative targets, progress statements, or initiatives).

### 4. Search Query Generation
For each claim, the system generates concise, company-specific web search queries to find independent verification sources.
Queries are designed to target authoritative data (e.g., UN, CDP, SBTi) and exclude the company's own domains.

### 5. Evidence Retrieval
Using the TavilySearch API, the system gathers supporting or contradicting evidence from official and independent ESG sources.

### 6. Claim Verification
For each claim, the LLM synthesizes external evidence and determines whether it is:
- Verified
- Contradicted
- Unsubstantiated

### 7. Greenwash Score Generation
A composite score (0-10) is computed based on the proportion of unverified and contradicted claims.
A higher score indicates a greater likelihood of greenwashing behavior or lack of transparency.
A concise summary explains the reasoning behind the score.

---

## Example Workflow

1. Input: company_name = "PepsiCo"
2. Retrieve relevant report sections from the Chroma database.
3. Identify ESG themes such as emissions, packaging, and water usage.
4. Extract measurable claims (e.g., Reduced water use intensity by 25% since 2015).
5. Generate search queries excluding company-controlled sites.
6. Search authoritative databases and collect relevant evidence.
7. Produce a structured report:
   - Claim-level verdicts (Verified / Contradicted / Unsubstantiated)
   - Final greenwash score and summary

Example output:

```json
{
  "company_name": "PepsiCo",
  "final_assessment": {
    "greenwash_score": 6,
    "summary": "Moderate concern â€” several claims unverified or contradicted by independent reports."
  },
  "final_report": [
    {
      "claim": "Reduced water use intensity by 25% since 2015",
      "status": "Verified",
      "synthesis": "Supported by 2024 CDP dataset and UN SDG 6 audit."
    },
    {
      "claim": "100% recyclable packaging in North America",
      "status": "Contradicted",
      "synthesis": "EPA 2023 report shows only 72% recyclable material usage."
    }
  ]
}
```

---

## Architecture

The project is implemented as a LangGraph state-based workflow, where each function represents a stage in the ESG claim verification pipeline.

<img width="242" height="928" alt="image" src="https://github.com/user-attachments/assets/5e702703-f373-4065-b928-0e7abf43cf74" />

Each step updates and passes along a shared state object containing:
- Company name
- Retrieved report sections
- Identified themes and claims
- Generated search queries
- Collected evidence
- Final synthesized assessment

---

## Technical Stack

| Component | Technology |
|------------|-------------|
| Programming Language | Python 3.11+ |
| LLM | OpenAI GPT-5 |
| Embedding Model | text-embedding-3-small |
| Vector Store | Chroma |
| Web Search | TavilySearch API |
| Frameworks | LangGraph, LangChain, Pydantic |

---

## Key Features

- Automated ESG theme extraction and claim identification
- Web-based evidence retrieval using targeted search queries
- Structured reasoning to generate claim-level verdicts
- Quantitative Greenwash Score summarizing credibility
- Modular, extensible workflow architecture using LangGraph

---

## Example Use Cases

- Investors: Assess credibility of sustainability disclosures before funding decisions
- Regulators: Detect potential cases of greenwashing for further audit
- Journalists: Access structured, verifiable ESG evidence
- Consumers: Understand the transparency of companies they support

---

## Future Improvements

- Integration with SEC and CDP APIs for direct data validation
- Web-based dashboard for visualization and user interaction
- Expansion to additional sustainability report datasets
- Sector-specific ESG benchmarks (e.g., energy, agriculture, manufacturing)

---

## Team and Hackathon Context

This project was developed for Gator Hacks 2025 by Team Greenwatch.
Our goal was to create a practical, AI-driven framework that brings accountability and transparency to ESG reporting.
