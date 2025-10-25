import React from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface ExecutiveSummaryProps {
  results: any;
}

export function ExecutiveSummary({ results }: ExecutiveSummaryProps) {
  const getScoreColor = (score: number) => {
    if (score < 30)
      return {
        bg: "bg-emerald-50 dark:bg-emerald-950/30",
        text: "text-emerald-700 dark:text-emerald-400",
        border: "border-emerald-200 dark:border-emerald-800",
        ring: "ring-emerald-100 dark:ring-emerald-900",
      };
    if (score < 60)
      return {
        bg: "bg-amber-50 dark:bg-amber-950/30",
        text: "text-amber-700 dark:text-amber-400",
        border: "border-amber-200 dark:border-amber-800",
        ring: "ring-amber-100 dark:ring-amber-900",
      };
    if (score < 80)
      return {
        bg: "bg-orange-50 dark:bg-orange-950/30",
        text: "text-orange-700 dark:text-orange-400",
        border: "border-orange-200 dark:border-orange-800",
        ring: "ring-orange-100 dark:ring-orange-900",
      };
    return {
      bg: "bg-red-50 dark:bg-red-950/30",
      text: "text-red-700 dark:text-red-400",
      border: "border-red-200 dark:border-red-800",
      ring: "ring-red-100 dark:ring-red-900",
    };
  };

  const getRiskBadge = (risk: string) => {
    const colors: { [key: string]: string } = {
      Low: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800",
      Medium:
        "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200/60 dark:border-amber-800",
      High: "bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400 border-orange-200/60 dark:border-orange-800",
      Critical:
        "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-200/60 dark:border-red-800",
    };
    return (
      colors[risk] ||
      "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-700"
    );
  };

  const getSeverityIcon = (severity: string) => {
    if (severity === "critical")
      return (
        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-500" />
      );
    if (severity === "high")
      return (
        <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-500" />
      );
    return (
      <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
    );
  };

  const scoreColors = getScoreColor(results.greenWatchScore);

  return (
    <div className="mt-8 space-y-6">
      {/* Company Header */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-slate-900 dark:text-slate-100">
                {results.companyName}
              </h2>
              <Badge
                variant="outline"
                className="text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700"
              >
                {results.ticker}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
              <span>{results.industry}</span>
              <span>•</span>
              <span>Updated {results.lastUpdated}</span>
            </div>
          </div>
          <Badge className={getRiskBadge(results.riskLevel)}>
            {results.riskLevel} Risk
          </Badge>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-4 gap-6">
        {/* Green Watch Score */}
        <Card
          className={`${scoreColors.bg} border ${scoreColors.border} p-6 shadow-sm ring-1 ${scoreColors.ring}`}
        >
          <div className="mb-3 text-slate-700 dark:text-slate-300">
            Green Watch Score
          </div>
          <div className={`${scoreColors.text} mb-2`}>
            <span className="text-5xl">{results.greenWatchScore}</span>
            <span className="text-2xl text-slate-400 dark:text-slate-500">
              /100
            </span>
          </div>
          <div className="text-slate-600 dark:text-slate-400">
            {results.greenWatchScore < 30 && "Low concern"}
            {results.greenWatchScore >= 30 &&
              results.greenWatchScore < 60 &&
              "Moderate concern"}
            {results.greenWatchScore >= 60 &&
              results.greenWatchScore < 80 &&
              "High concern"}
            {results.greenWatchScore >= 80 && "Critical concern"}
          </div>
        </Card>

        {/* Emissions */}
        <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="text-slate-700 dark:text-slate-300">
              Total Emissions
            </div>
            <div
              className={`flex items-center gap-1 ${
                results.quantitativeData.emissionsChange > 0
                  ? "text-red-600 dark:text-red-500"
                  : "text-emerald-600 dark:text-emerald-500"
              }`}
            >
              {results.quantitativeData.emissionsChange > 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{Math.abs(results.quantitativeData.emissionsChange)}%</span>
            </div>
          </div>
          <div className="text-slate-900 dark:text-slate-100 mb-1">
            {results.quantitativeData.totalEmissions.toLocaleString()}
          </div>
          <div className="text-slate-500 dark:text-slate-400">
            tCO₂e annually
          </div>
        </Card>

        {/* Deforestation */}
        <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="text-slate-700 dark:text-slate-300">
              Deforestation Area
            </div>
            <div
              className={`flex items-center gap-1 ${
                results.quantitativeData.deforestationChange > 0
                  ? "text-red-600 dark:text-red-500"
                  : "text-emerald-600 dark:text-emerald-500"
              }`}
            >
              {results.quantitativeData.deforestationChange > 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>
                {Math.abs(results.quantitativeData.deforestationChange)}%
              </span>
            </div>
          </div>
          <div className="text-slate-900 dark:text-slate-100 mb-1">
            {results.quantitativeData.deforestationArea.toLocaleString()}
          </div>
          <div className="text-slate-500 dark:text-slate-400">
            hectares (YoY)
          </div>
        </Card>

        {/* Suppliers */}
        <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm">
          <div className="mb-3 text-slate-700 dark:text-slate-300">
            High-Risk Suppliers
          </div>
          <div className="text-slate-900 dark:text-slate-100 mb-1">
            {results.suppliers.filter((s: any) => s.riskScore > 70).length} /{" "}
            {results.suppliers.length}
          </div>
          <div className="text-slate-500 dark:text-slate-400">
            in supply chain
          </div>
        </Card>
      </div>

      {/* Critical Alerts */}
      <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm">
        <h3 className="text-slate-900 dark:text-slate-100 mb-4">
          Critical Findings
        </h3>
        <div className="space-y-3">
          {results.insights.map((insight: any, index: number) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700"
            >
              <div className="mt-0.5">{getSeverityIcon(insight.severity)}</div>
              <div className="flex-1 min-w-0">
                <div className="text-slate-900 dark:text-slate-100 mb-1">
                  {insight.title}
                </div>
                <div className="text-slate-600 dark:text-slate-400">
                  {insight.description}
                </div>
              </div>
              <Badge
                variant="outline"
                className="text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 shrink-0"
              >
                {insight.severity.charAt(0).toUpperCase() +
                  insight.severity.slice(1)}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Claims & Commodities */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm">
          <h3 className="text-slate-900 dark:text-slate-100 mb-4">
            Sustainability Claims
          </h3>
          <div className="space-y-3">
            {results.claims.map((claim: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {claim.verified ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-500 shrink-0" />
                  )}
                  <span className="text-slate-700 dark:text-slate-300 truncate">
                    {claim.claim}
                  </span>
                </div>
                <span className="text-slate-500 dark:text-slate-400 ml-4 shrink-0">
                  {claim.confidence}%
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm">
          <h3 className="text-slate-900 dark:text-slate-100 mb-4">
            Top Risk Commodities
          </h3>
          <div className="space-y-3">
            {results.commodities
              .filter(
                (c: any) =>
                  c.deforestationRisk === "Critical" ||
                  c.deforestationRisk === "High"
              )
              .slice(0, 4)
              .map((commodity: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-slate-900 dark:text-slate-100">
                      {commodity.name}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400">
                      {commodity.volume.toLocaleString()} tons/year
                    </div>
                  </div>
                  <Badge
                    className={
                      commodity.deforestationRisk === "Critical"
                        ? "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-200/60 dark:border-red-800 shrink-0 ml-4"
                        : "bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400 border-orange-200/60 dark:border-orange-800 shrink-0 ml-4"
                    }
                  >
                    {commodity.deforestationRisk}
                  </Badge>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
