import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';

interface Commodity {
  name: string;
  volume: number;
  percentOfTotal: number;
  deforestationRisk: string;
  trend: string;
  emissions: number;
}

interface CommodityBreakdownProps {
  commodities: Commodity[];
}

export function CommodityBreakdown({ commodities }: CommodityBreakdownProps) {
  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#06b6d4'];

  const pieData = commodities.map((c, i) => ({
    name: c.name,
    value: c.percentOfTotal,
    volume: c.volume,
  }));

  const getRiskBadge = (risk: string) => {
    const colors: { [key: string]: string } = {
      'Low': 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      'Medium': 'bg-amber-50 text-amber-700 border-amber-200/60',
      'High': 'bg-orange-50 text-orange-700 border-orange-200/60',
      'Critical': 'bg-red-50 text-red-700 border-red-200/60',
    };
    return <Badge className={colors[risk] || 'bg-slate-50 text-slate-700 border-slate-200/60'}>{risk}</Badge>;
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'increasing') return <TrendingUp className="w-4 h-4 text-red-600" />;
    if (trend === 'decreasing') return <TrendingDown className="w-4 h-4 text-emerald-600" />;
    return <Minus className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <Card className="p-6 bg-white border border-slate-200/60 shadow-sm">
        <h3 className="text-slate-900 mb-6">Portfolio Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              stroke="#ffffff"
              strokeWidth={2}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              formatter={(value: any, name: any, props: any) => [
                `${props.payload.volume.toLocaleString()} tons`,
                props.payload.name
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 bg-white border border-slate-200/60 shadow-sm">
        <h3 className="text-slate-900 mb-6">Risk Analysis by Commodity</h3>
        <div className="space-y-4">
          {commodities.map((commodity, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-slate-900">{commodity.name}</span>
                  {getTrendIcon(commodity.trend)}
                </div>
                {getRiskBadge(commodity.deforestationRisk)}
              </div>
              <div className="flex items-center gap-4 text-slate-600">
                <span>{commodity.volume.toLocaleString()} tons</span>
                <span>•</span>
                <span>{commodity.emissions.toLocaleString()} tCO₂e</span>
              </div>
              <Progress value={commodity.percentOfTotal * 3.3} className="h-2" />
            </div>
          ))}
        </div>
      </Card>

      <Card className="col-span-2 p-6 bg-gradient-to-br from-red-50 to-orange-50 border border-red-200/60 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-slate-900 mb-2">High-Risk Commodity Alert</h4>
            <p className="text-slate-700 mb-4">
              {commodities.filter(c => c.deforestationRisk === 'Critical' || c.deforestationRisk === 'High').length} commodities 
              ({commodities.filter(c => c.deforestationRisk === 'Critical' || c.deforestationRisk === 'High').reduce((acc, c) => acc + c.percentOfTotal, 0)}% of portfolio) 
              are sourced from high or critical deforestation risk regions. These commodities are directly linked to areas experiencing 
              active forest loss, contradicting sustainability commitments.
            </p>
            <Badge variant="outline" className="text-blue-700 border-blue-300 bg-white">
              Supplier Audit Required
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}
