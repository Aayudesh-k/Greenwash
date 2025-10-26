import React from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Shield,
  Target,
  BarChart3,
} from "lucide-react";
import { AnalysisResponse } from "../types";
import { ThemesDisplay } from "./ThemesDisplay";
import { EvidenceDisplay } from "./EvidenceDisplay";
import { AnalysisProgress } from "./AnalysisProgress";

interface ExecutiveSummaryProps {
  analysisData: AnalysisResponse;
}

export function ExecutiveSummary({ analysisData }: ExecutiveSummaryProps) {
  const getScoreColor = (score: number) => {
    if (score <= 2)
      return {
        bg: "bg-emerald-50 dark:bg-emerald-950/30",
        text: "text-emerald-700 dark:text-emerald-400",
        border: "border-emerald-200 dark:border-emerald-800",
        ring: "ring-emerald-100 dark:ring-emerald-900",
        icon: (
          <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        ),
      };
    if (score <= 4)
      return {
        bg: "bg-amber-50 dark:bg-amber-950/30",
        text: "text-amber-700 dark:text-amber-400",
        border: "border-amber-200 dark:border-amber-800",
        ring: "ring-amber-100 dark:ring-amber-900",
        icon: (
          <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
        ),
      };
    if (score <= 7)
      return {
        bg: "bg-orange-50 dark:bg-orange-950/30",
        text: "text-orange-700 dark:text-orange-400",
        border: "border-orange-200 dark:border-orange-800",
        ring: "ring-orange-100 dark:ring-orange-900",
        icon: (
          <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
        ),
      };
    return {
      bg: "bg-red-50 dark:bg-red-950/30",
      text: "text-red-700 dark:text-red-400",
      border: "border-red-200 dark:border-red-800",
      ring: "ring-red-100 dark:ring-red-900",
      icon: <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />,
    };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Verified":
        return (
          <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
        );
      case "Contradicted":
        return <XCircle className="w-5 h-5 text-red-600 dark:text-red-500" />;
      case "Unsubstantiated":
        return (
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
        );
      default:
        return (
          <AlertCircle className="w-5 h-5 text-slate-600 dark:text-slate-500" />
        );
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Verified":
        return "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800 text-sm";
      case "Contradicted":
        return "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-200/60 dark:border-red-800 text-sm";
      case "Unsubstantiated":
        return "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200/60 dark:border-amber-800 text-sm";
      default:
        return "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-700 text-sm";
    }
  };

  const greenwashScore = analysisData.final_assessment?.greenwash_score || 0;
  const scoreColors = getScoreColor(greenwashScore);

  const claimStats =
    analysisData.final_report?.reduce((acc, claim) => {
      acc[claim.status] = (acc[claim.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

  return (
    <div className="mt-8 space-y-6">
      {/* Header with Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Greenwash Score Card */}
        <Card
          className={`lg:col-span-2 ${scoreColors.bg} border ${scoreColors.border} p-6 shadow-sm ring-1 ${scoreColors.ring}`}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {scoreColors.icon}
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Greenwash Score
                </h2>
              </div>
              <div className={`${scoreColors.text} mb-2`}>
                <span className="text-4xl font-bold">{greenwashScore}</span>
                <span className="text-xl text-slate-400 dark:text-slate-500 ml-2">
                  / 10
                </span>
              </div>
              <div className="text-base font-medium text-slate-600 dark:text-slate-400">
                {greenwashScore <= 2 &&
                  "✅ Low concern - Claims appear credible"}
                {greenwashScore > 2 &&
                  greenwashScore <= 5 &&
                  "⚠️ Moderate concern - Some claims questionable"}
                {greenwashScore > 5 &&
                  greenwashScore <= 8 &&
                  "🚨 High concern - Multiple red flags"}
                {greenwashScore > 8 &&
                  "🔥 Critical concern - Significant greenwashing detected"}
              </div>
            </div>
          </div>

          {analysisData.final_assessment?.summary && (
            <div className="p-4 bg-white/50 dark:bg-slate-900/50 rounded-lg border border-slate-200/60 dark:border-slate-800 shadow-sm">
              <div className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                {analysisData.final_assessment.summary}
              </div>
            </div>
          )}
        </Card>

        <ThemesDisplay themes={analysisData.themes || []} />

        {/* Claim Statistics */}
        <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm">
          <h3 className="text-xl text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Claim Statistics
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                <span className="text-slate-700 dark:text-slate-300">
                  Verified
                </span>
              </div>
              <Badge className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800 text-sm">
                {claimStats.Verified || 0}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-600 dark:text-red-500" />
                <span className="text-slate-700 dark:text-slate-300">
                  Contradicted
                </span>
              </div>
              <Badge className="bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-200/60 dark:border-red-800 text-sm">
                {claimStats.Contradicted || 0}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-500" />
                <span className="text-slate-700 dark:text-slate-300">
                  Unsubstantiated
                </span>
              </div>
              <Badge className="bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200/60 dark:border-amber-800 text-sm">
                {claimStats.Unsubstantiated || 0}
              </Badge>
            </div>

            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>Total Claims</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {analysisData.final_report?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="claims" className="w-full">
        <TabsList className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-1 h-auto shadow-sm">
          <TabsTrigger
            value="claims"
            className="data-[state=active]:bg-emerald-50 dark:data-[state=active]:bg-emerald-950/50 data-[state=active]:text-emerald-900 dark:data-[state=active]:text-emerald-400"
          >
            <Target className="w-4 h-4 mr-2" />
            Claims Analysis
          </TabsTrigger>
          <TabsTrigger
            value="evidence"
            className="data-[state=active]:bg-emerald-50 dark:data-[state=active]:bg-emerald-950/50 data-[state=active]:text-emerald-900 dark:data-[state=active]:text-emerald-400"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Evidence Sources
          </TabsTrigger>
          <TabsTrigger
            value="progress"
            className="data-[state=active]:bg-emerald-50 dark:data-[state=active]:bg-emerald-950/50 data-[state=active]:text-emerald-900 dark:data-[state=active]:text-emerald-400"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Analysis Progress
          </TabsTrigger>
        </TabsList>

        <TabsContent value="claims" className="mt-6">
          {analysisData?.final_report &&
            analysisData?.final_report?.length > 0 && (
              <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm">
                <h3 className="text-xl text-slate-900 dark:text-slate-100 mb-4">
                  Detailed Claims Analysis
                </h3>
                <div className="space-y-4">
                  {analysisData?.final_report.map((claim, index) => (
                    <div
                      key={index}
                      className="p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-lg border border-slate-200/60 dark:border-slate-800 shadow-sm"
                    >
                      <div className="flex items-start gap-3 mb-2">
                        {getStatusIcon(claim.status)}
                        <div className="flex-1">
                          <div className="text-base font-medium text-slate-900 dark:text-slate-100 mb-2">
                            {claim.claim}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                            {claim.synthesis}
                          </div>
                          <Badge className={getStatusBadgeColor(claim.status)}>
                            {claim.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
        </TabsContent>

        <TabsContent value="evidence" className="mt-6">
          <EvidenceDisplay
            evidence={analysisData.evidence || []}
            claims={analysisData.claims || []}
          />
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <AnalysisProgress
            retrievedDocs={analysisData.retrieved_docs}
            claims={analysisData.claims}
            searchQueries={analysisData.search_queries}
            status={analysisData.status}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
