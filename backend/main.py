from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agent import agent
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

task_results = {}


class SustainabilityReportRequest(BaseModel):
    company_name: str


def run_agent(task_id: str, company_name: str):
    try:
        state = agent.invoke({"company_name": company_name})

        retrieved_docs = []
        for doc in state.get("retrieved_docs", []):
            retrieved_docs.append(
                {
                    "page_content": doc.page_content,
                    "metadata": {
                        "source": doc.metadata.get("source", "unknown"),
                        "page": doc.metadata.get("page", "N/A"),
                    },
                }
            )

        task_results[task_id] = {
            "final_report": state.get("final_report", []),
            "final_assessment": state.get("final_assessment", {}),
            "themes": state.get("themes", []),
            "claims": state.get("claims", []),
            "search_queries": state.get("search_queries", []),
            "retrieved_docs": retrieved_docs,
            "evidence": state.get("evidence", []),
            "status": "completed",
        }
    except Exception as e:
        task_results[task_id] = {
            "error": str(e),
            "status": "failed",
        }


@app.post("/sustainability-report")
def sustainability_report(
    request: SustainabilityReportRequest, background_tasks: BackgroundTasks
):
    task_id = str(uuid.uuid4())

    task_results[task_id] = {"status": "running"}

    background_tasks.add_task(run_agent, task_id, request.company_name)

    return {"task_id": task_id}


@app.get("/sustainability-report/{task_id}")
def get_report(task_id: str):
    result = task_results.get(task_id)
    if not result:
        return {"error": "Task ID not found"}
    return result
