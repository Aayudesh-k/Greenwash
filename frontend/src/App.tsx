import React, { useState, useEffect } from "react";
import { SearchForm } from "./components/SearchForm";
import { ExecutiveSummary } from "./components/ExecutiveSummary";
import { Header } from "./components/Header";
import { Card } from "./components/ui/card";
import { ApiService } from "./services/api";
import { AnalysisResponse } from "./types";

export default function App() {
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleSearch = async (companyName: string) => {
    setIsLoading(true);
    setError(null);
    setAnalysisData(null);

    try {
      // Submit analysis request
      const submitResponse = await ApiService.submitAnalysis(companyName);
      
      // Start polling for results
      ApiService.pollAnalysisStatus(
        submitResponse.task_id,
        (data: AnalysisResponse) => {
          console.log("Received analysis data:", data);
          setAnalysisData(data);
          if (data.status === 'completed' || data.status === 'failed') {
            setIsLoading(false);
          }
        },
        (error: string) => {
          setError(error);
          setIsLoading(false);
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start analysis');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="container mx-auto px-8 py-8">
        <div className="mb-8">
          <h1 className="text-slate-900 dark:text-slate-100 mb-2">
            ESG Greenwashing Detection
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            AI-powered verification of corporate sustainability claims through
            real-time web research and evidence analysis
          </p>
        </div>

        <SearchForm onSearch={handleSearch} isLoading={isLoading} />

        {isLoading && (
          <div className="mt-12 space-y-6">
            <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm">
              <h3 className="text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <div className="w-5 h-5 bg-blue-600 dark:bg-emerald-500 rounded-full animate-pulse"></div>
                AI Analysis in Progress
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                  <div className="w-1.5 h-1.5 bg-blue-600 dark:bg-emerald-500 rounded-full animate-pulse"></div>
                  <p>🔍 Analyzing ESG reports and extracting key themes...</p>
                </div>
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                  <div
                    className="w-1.5 h-1.5 bg-blue-600 dark:bg-emerald-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <p>📋 Identifying specific sustainability claims...</p>
                </div>
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                  <div
                    className="w-1.5 h-1.5 bg-blue-600 dark:bg-emerald-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                  <p>🌐 Searching web for verification evidence...</p>
                </div>
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                  <div
                    className="w-1.5 h-1.5 bg-blue-600 dark:bg-emerald-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.6s" }}
                  ></div>
                  <p>🧠 AI analyzing evidence and generating greenwash score...</p>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800 rounded-lg">
                <p className="text-emerald-700 dark:text-emerald-400 text-sm">
                  💡 This process typically takes 30-60 seconds as our AI thoroughly investigates each claim
                </p>
              </div>
            </Card>
          </div>
        )}

        {error && (
          <div className="mt-8 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200/60 dark:border-red-800 rounded-lg shadow-sm">
            <p className="text-red-700 dark:text-red-400">
              Error: {error}
            </p>
          </div>
        )}

        {analysisData && analysisData.status === 'completed' && !isLoading && (
          <ExecutiveSummary analysisData={analysisData} />
        )}

        {analysisData && analysisData.status === 'failed' && !isLoading && (
          <div className="mt-8 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200/60 dark:border-red-800 rounded-lg shadow-sm">
            <p className="text-red-700 dark:text-red-400">
              Analysis failed: {analysisData.error || 'Unknown error occurred'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
