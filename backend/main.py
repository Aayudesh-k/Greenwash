from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel
from agent import agent
import uuid

app = FastAPI()

task_results = {}


class SustainabilityReportRequest(BaseModel):
    company_name: str


def run_agent(task_id: str, company_name: str):
    try:
        state = agent.invoke({"company_name": company_name})
        task_results[task_id] = {
            "final_report": state.get("final_report", []),
            "final_assessment": state.get("final_assessment", {}),
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
