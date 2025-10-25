import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { MapPin, AlertTriangle } from "lucide-react";
import React, { useState } from "react";

interface Supplier {
  id: number;
  name: string;
  location: string;
  commodity: string;
  riskScore: number;
  emissions: number;
  deforestationLink: boolean;
  volume: number;
}

interface SupplyChainTableProps {
  suppliers: Supplier[];
}

export function SupplyChainTable({ suppliers }: SupplyChainTableProps) {
  const [sortKey, setSortKey] = useState<keyof Supplier>("riskScore");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const sortedSuppliers = [...suppliers].sort((a, b) => {
    if (sortOrder === "asc") {
      return a[sortKey] > b[sortKey] ? 1 : -1;
    }
    return a[sortKey] < b[sortKey] ? 1 : -1;
  });

  const getRiskBadge = (score: number) => {
    if (score < 30)
      return (
        <Badge className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800">
          Low
        </Badge>
      );
    if (score < 60)
      return (
        <Badge className="bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200/60 dark:border-amber-800">
          Medium
        </Badge>
      );
    if (score < 80)
      return (
        <Badge className="bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400 border-orange-200/60 dark:border-orange-800">
          High
        </Badge>
      );
    return (
      <Badge className="bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-200/60 dark:border-red-800">
        Critical
      </Badge>
    );
  };

  const getScoreColor = (score: number) => {
    if (score < 30) return "text-emerald-700 dark:text-emerald-400";
    if (score < 60) return "text-amber-700 dark:text-amber-400";
    if (score < 80) return "text-orange-700 dark:text-orange-400";
    return "text-red-700 dark:text-red-400";
  };

  return (
    <Card className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-slate-900 dark:text-slate-100">
          Supplier Risk Assessment
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Analysis of {suppliers.length} suppliers across global supply chain
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200/60 dark:border-slate-700">
              <TableHead className="text-slate-700 dark:text-slate-300">
                Supplier
              </TableHead>
              <TableHead className="text-slate-700 dark:text-slate-300">
                Location
              </TableHead>
              <TableHead className="text-slate-700 dark:text-slate-300">
                Commodity
              </TableHead>
              <TableHead className="text-slate-700 dark:text-slate-300 text-right">
                Volume (tons/yr)
              </TableHead>
              <TableHead className="text-slate-700 dark:text-slate-300 text-right">
                Emissions (tCO₂e)
              </TableHead>
              <TableHead className="text-slate-700 dark:text-slate-300 text-center">
                Risk Score
              </TableHead>
              <TableHead className="text-slate-700 dark:text-slate-300">
                Risk Level
              </TableHead>
              <TableHead className="text-slate-700 dark:text-slate-300">
                Alerts
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSuppliers.map((supplier) => (
              <TableRow
                key={supplier.id}
                className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <TableCell>
                  <div className="text-slate-900 dark:text-slate-100">
                    {supplier.name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    {supplier.location}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-slate-700 dark:text-slate-300">
                    {supplier.commodity}
                  </div>
                </TableCell>
                <TableCell className="text-right text-slate-700 dark:text-slate-300">
                  {supplier.volume.toLocaleString()}
                </TableCell>
                <TableCell className="text-right text-slate-700 dark:text-slate-300">
                  {supplier.emissions.toLocaleString()}
                </TableCell>
                <TableCell className="text-center">
                  <span className={getScoreColor(supplier.riskScore)}>
                    {supplier.riskScore}
                  </span>
                </TableCell>
                <TableCell>{getRiskBadge(supplier.riskScore)}</TableCell>
                <TableCell>
                  {supplier.deforestationLink && (
                    <Badge
                      variant="outline"
                      className="text-red-600 dark:text-red-500 border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/50"
                    >
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Deforestation
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="p-4 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <div className="w-2 h-2 bg-red-500 dark:bg-red-600 rounded-full"></div>
          <span>
            {suppliers.filter((s) => s.riskScore > 70).length} suppliers flagged
            as high or critical risk
          </span>
        </div>
      </div>
    </Card>
  );
}
