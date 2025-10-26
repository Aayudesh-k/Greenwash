import React, { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  ExternalLink,
  Search,
  FileText,
  Globe,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { EvidenceItem, Claim } from "../types";

interface EvidenceDisplayProps {
  evidence: EvidenceItem[];
  claims: Claim[];
}

const getSourceIcon = (source: string) => {
  if (source.includes("report") || source.includes("pdf")) {
    return <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
  }
  if (source.includes("http")) {
    return <Globe className="w-4 h-4 text-green-600 dark:text-green-400" />;
  }
  return <Search className="w-4 h-4 text-slate-600 dark:text-slate-400" />;
};

const getSourceWeight = (weight: number) => {
  if (weight >= 3) return "High";
  if (weight >= 2) return "Medium";
  return "Low";
};

const getSourceWeightColor = (weight: number) => {
  if (weight >= 3)
    return "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800";
  if (weight >= 2)
    return "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200/60 dark:border-amber-800";
  return "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-700";
};

export function EvidenceDisplay({ evidence, claims }: EvidenceDisplayProps) {
  const [expandedClaim, setExpandedClaim] = useState<string | null>(null);

  // Debug logging
  console.log("EvidenceDisplay received evidence:", evidence);
  console.log("EvidenceDisplay received claims:", claims);

  if (!evidence || evidence.length === 0) {
    console.log("EvidenceDisplay: No evidence to display");
    return (
      <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm">
        <h3 className="text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Evidence Sources & Verification
        </h3>
        <div className="text-slate-500 dark:text-slate-400 text-center py-8">
          No evidence sources were found during the analysis.
        </div>
      </Card>
    );
  }

  // Group evidence by claim
  const evidenceByClaim = evidence.reduce((acc, item) => {
    if (!acc[item.claim_text]) {
      acc[item.claim_text] = [];
    }
    acc[item.claim_text].push(item);
    return acc;
  }, {} as Record<string, EvidenceItem[]>);

  const toggleExpanded = (claimText: string) => {
    setExpandedClaim(expandedClaim === claimText ? null : claimText);
  };

  return (
    <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm">
      <h3 className="text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
        <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        Evidence Sources & Verification
      </h3>

      <div className="space-y-4">
        {Object.entries(evidenceByClaim).map(([claimText, claimEvidence]) => {
          const isExpanded = expandedClaim === claimText;
          const hasEvidence = claimEvidence.some(
            (item) => item.snippet && item.source
          );
          const evidenceCount = claimEvidence.filter(
            (item) => item.snippet && item.source
          ).length;

          return (
            <div
              key={claimText}
              className="border border-slate-200/60 dark:border-slate-800 rounded-xl shadow-sm"
            >
              <Button
                variant="ghost"
                onClick={() => toggleExpanded(claimText)}
                className="w-full justify-between p-4 text-left text-md h-auto hover:bg-accent dark:hover:bg-accent/50 whitespace-normal"
              >
                <div className="flex items-start gap-3 w-full min-w-0">
                  {/* Icon */}
                  {hasEvidence ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-500 mt-0.5 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
                  )}

                  {/* Text + badge */}
                  <div className="flex-1 flex flex-col min-w-0">
                    {/* Claim text */}
                    <div className="text-slate-900 dark:text-slate-100 font-medium break-words">
                      {claimText}
                    </div>

                    {/* Evidence count + badge */}
                    <div className="flex items-center gap-2  text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                      <span>
                        {evidenceCount} evidence source
                        {evidenceCount !== 1 ? "s" : ""}
                      </span>
                      {hasEvidence && (
                        <Badge
                          className={getSourceWeightColor(
                            Math.max(...claimEvidence.map((e) => e.weight))
                          )}
                        >
                          {getSourceWeight(
                            Math.max(...claimEvidence.map((e) => e.weight))
                          )}{" "}
                          Priority
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Chevron */}
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                )}
              </Button>
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 space-y-3">
                  {claimEvidence.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          {getSourceIcon(item.source)}
                          <div className="flex-1 flex flex-col gap-2 min-w-0">
                            {item.snippet && (
                              <div className="text-slate-700 dark:text-slate-300  break-words leading-relaxed">
                                "{item.snippet}"
                              </div>
                            )}
                            {item.source && (
                              <div className="flex items-center gap-1.5">
                                <a
                                  href={item.source}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 dark:text-blue-400 hover:underline  truncate"
                                >
                                  {item.source}
                                </a>
                                <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                              </div>
                            )}
                            {item.note && (
                              <div className="text-amber-600 dark:text-amber-400 text-xs mt-0.5 break-words leading-relaxed">
                                {item.note}
                              </div>
                            )}
                          </div>
                        </div>
                        <Badge className={getSourceWeightColor(item.weight)}>
                          {getSourceWeight(item.weight)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
