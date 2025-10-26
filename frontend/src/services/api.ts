import { AnalysisResponse, SubmitAnalysisRequest, SubmitAnalysisResponse } from '../types';

const API_BASE_URL = 'http://localhost:8000';

export class ApiService {
  static async submitAnalysis(companyName: string): Promise<SubmitAnalysisResponse> {
    const response = await fetch(`${API_BASE_URL}/sustainability-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_name: companyName }),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit analysis: ${response.statusText}`);
    }

    return response.json();
  }

  static async getAnalysisStatus(taskId: string): Promise<AnalysisResponse> {
    const response = await fetch(`${API_BASE_URL}/sustainability-report/${taskId}`);

    if (!response.ok) {
      throw new Error(`Failed to get analysis status: ${response.statusText}`);
    }

    return response.json();
  }

  static async pollAnalysisStatus(
    taskId: string,
    onUpdate: (data: AnalysisResponse) => void,
    onError: (error: string) => void,
    intervalMs: number = 5000
  ): Promise<void> {
    const poll = async () => {
      try {
        const data = await this.getAnalysisStatus(taskId);
        onUpdate(data);

        if (data.status === 'running') {
          setTimeout(poll, intervalMs);
        }
      } catch (error) {
        onError(error instanceof Error ? error.message : 'Unknown error occurred');
      }
    };

    poll();
  }
}
