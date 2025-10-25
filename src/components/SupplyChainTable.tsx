import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { MapPin, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

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
  const [sortKey, setSortKey] = useState<keyof Supplier>('riskScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedSuppliers = [...suppliers].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a[sortKey] > b[sortKey] ? 1 : -1;
    }
    return a[sortKey] < b[sortKey] ? 1 : -1;
  });

  const getRiskBadge = (score: number) => {
    if (score < 30) return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200/60">Low</Badge>;
    if (score < 60) return <Badge className="bg-amber-50 text-amber-700 border-amber-200/60">Medium</Badge>;
    if (score < 80) return <Badge className="bg-orange-50 text-orange-700 border-orange-200/60">High</Badge>;
    return <Badge className="bg-red-50 text-red-700 border-red-200/60">Critical</Badge>;
  };

  const getScoreColor = (score: number) => {
    if (score < 30) return 'text-emerald-700';
    if (score < 60) return 'text-amber-700';
    if (score < 80) return 'text-orange-700';
    return 'text-red-700';
  };

  return (
    <Card className="bg-white border border-slate-200/60 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100">
        <h3 className="text-slate-900">Supplier Risk Assessment</h3>
        <p className="text-slate-600 mt-1">
          Analysis of {suppliers.length} suppliers across global supply chain
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 border-b border-slate-200/60">
              <TableHead className="text-slate-700">Supplier</TableHead>
              <TableHead className="text-slate-700">Location</TableHead>
              <TableHead className="text-slate-700">Commodity</TableHead>
              <TableHead className="text-slate-700 text-right">Volume (tons/yr)</TableHead>
              <TableHead className="text-slate-700 text-right">Emissions (tCO₂e)</TableHead>
              <TableHead className="text-slate-700 text-center">Risk Score</TableHead>
              <TableHead className="text-slate-700">Risk Level</TableHead>
              <TableHead className="text-slate-700">Alerts</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSuppliers.map((supplier) => (
              <TableRow 
                key={supplier.id} 
                className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
              >
                <TableCell>
                  <div className="text-slate-900">{supplier.name}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {supplier.location}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-slate-700">{supplier.commodity}</div>
                </TableCell>
                <TableCell className="text-right text-slate-700">
                  {supplier.volume.toLocaleString()}
                </TableCell>
                <TableCell className="text-right text-slate-700">
                  {supplier.emissions.toLocaleString()}
                </TableCell>
                <TableCell className="text-center">
                  <span className={getScoreColor(supplier.riskScore)}>
                    {supplier.riskScore}
                  </span>
                </TableCell>
                <TableCell>
                  {getRiskBadge(supplier.riskScore)}
                </TableCell>
                <TableCell>
                  {supplier.deforestationLink && (
                    <Badge variant="outline" className="text-red-600 border-red-300 bg-red-50">
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

      <div className="p-4 bg-slate-50/50 border-t border-slate-100">
        <div className="flex items-center gap-2 text-slate-600">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span>
            {suppliers.filter(s => s.riskScore > 70).length} suppliers flagged as high or critical risk
          </span>
        </div>
      </div>
    </Card>
  );
}
