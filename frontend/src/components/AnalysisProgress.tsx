import React from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Search, 
  FileText, 
  Globe, 
  CheckCircle2, 
  Clock,
  AlertCircle,
  Database,
  Brain
} from "lucide-react";
import { RetrievedDoc, Claim } from "../types";

interface AnalysisProgressProps {
  retrievedDocs?: RetrievedDoc[];
  claims?: Claim[];
  searchQueries?: string[];
  status: "running" | "completed" | "failed";
}

const getStepIcon = (step: string, status: "completed" | "running" | "pending") => {
  const baseClasses = "w-5 h-5";
  
  switch (status) {
    case "completed":
      return <CheckCircle2 className={`${baseClasses} text-green-600 dark:text-green-400`} />;
    case "running":
      return <Clock className={`${baseClasses} text-blue-600 dark:text-blue-400 animate-spin`} />;
    default:
      return <AlertCircle className={`${baseClasses} text-slate-400 dark:text-slate-500`} />;
  }
};

const getStepStatus = (step: string, data: any, status: string) => {
  if (status === "failed") return "pending";
  if (status === "completed") return "completed";
  
  switch (step) {
    case "retrieval":
      return data && data.length > 0 ? "completed" : "running";
    case "claims":
      return data && data.length > 0 ? "completed" : "running";
    case "search":
      return data && data.length > 0 ? "completed" : "running";
    case "analysis":
      return status === "completed" ? "completed" : "running";
    default:
      return "pending";
  }
};

export function AnalysisProgress({ retrievedDocs, claims, searchQueries, status }: AnalysisProgressProps) {
  const steps = [
    {
      id: "retrieval",
      title: "Document Retrieval",
      description: "Searching ESG reports database",
      icon: <Database className="w-4 h-4" />,
      data: retrievedDocs,
      count: retrievedDocs?.length || 0
    },
    {
      id: "claims",
      title: "Claims Extraction", 
      description: "Identifying key ESG claims",
      icon: <FileText className="w-4 h-4" />,
      data: claims,
      count: claims?.length || 0
    },
    {
      id: "search",
      title: "Evidence Search",
      description: "Searching web for verification",
      icon: <Search className="w-4 h-4" />,
      data: searchQueries,
      count: searchQueries?.length || 0
    },
    {
      id: "analysis",
      title: "AI Analysis",
      description: "Generating greenwash score",
      icon: <Brain className="w-4 h-4" />,
      data: null,
      count: status === "completed" ? 1 : 0
    }
  ];

  return (
    <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm">
      <h3 className="text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
        <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        Analysis Progress
      </h3>
      
      <div className="space-y-4">
        {steps.map((step, index) => {
          const stepStatus = getStepStatus(step.id, step.data, status);
          const isCompleted = stepStatus === "completed";
          const isRunning = stepStatus === "running";
          
          return (
            <div key={step.id} className="flex items-center gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 shrink-0">
                {getStepIcon(step.id, stepStatus)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-slate-900 dark:text-slate-100 font-medium">
                    {step.title}
                  </span>
                  {step.count > 0 && (
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        isCompleted 
                          ? "border-emerald-200/60 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
                          : "border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {step.count} item{step.count !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {step.description}
                </div>
              </div>
              
              {isRunning && (
                <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"></div>
                  Processing...
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {status === "completed" && (
        <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800 rounded-lg">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-sm">
            <CheckCircle2 className="w-4 h-4" />
            Analysis completed successfully
          </div>
        </div>
      )}
    </Card>
  );
}
