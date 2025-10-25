import { Card } from './ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface EnvironmentalMetricsProps {
  data: any;
}

export function EnvironmentalMetrics({ data }: EnvironmentalMetricsProps) {
  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-6 bg-white border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="text-slate-700">CO₂ Emissions</div>
            <div className={`flex items-center gap-1 ${data.emissionsChange > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {data.emissionsChange > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{Math.abs(data.emissionsChange)}%</span>
            </div>
          </div>
          <div className="text-slate-900 mb-1">{data.totalEmissions.toLocaleString()}</div>
          <div className="text-slate-500">tCO₂e/year</div>
        </Card>

        <Card className="p-6 bg-white border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="text-slate-700">Deforestation</div>
            <div className={`flex items-center gap-1 ${data.deforestationChange > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {data.deforestationChange > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{Math.abs(data.deforestationChange)}%</span>
            </div>
          </div>
          <div className="text-slate-900 mb-1">{data.deforestationArea.toLocaleString()}</div>
          <div className="text-slate-500">hectares/year</div>
        </Card>

        <Card className="p-6 bg-white border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="text-slate-700">Water Usage</div>
            <div className={`flex items-center gap-1 ${data.waterChange > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {data.waterChange > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{Math.abs(data.waterChange)}%</span>
            </div>
          </div>
          <div className="text-slate-900 mb-1">{data.waterUsage.toLocaleString()}</div>
          <div className="text-slate-500">m³/year</div>
        </Card>

        <Card className="p-6 bg-white border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="text-slate-700">Waste Generated</div>
            <div className={`flex items-center gap-1 ${data.wasteChange > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {data.wasteChange > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{Math.abs(data.wasteChange)}%</span>
            </div>
          </div>
          <div className="text-slate-900 mb-1">{data.wasteGenerated.toLocaleString()}</div>
          <div className="text-slate-500">tons/year</div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Emissions by Supplier */}
        <Card className="p-6 bg-white border border-slate-200/60 shadow-sm">
          <h3 className="text-slate-900 mb-4">Emissions by Supplier</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.emissionsBySupplier}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis 
                dataKey="supplier" 
                tick={{ fill: '#64748b', fontSize: 12 }}
                angle={-20}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value: any) => [`${value.toLocaleString()} tCO₂e`, 'Emissions']}
              />
              <Bar dataKey="emissions" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Emissions by Category */}
        <Card className="p-6 bg-white border border-slate-200/60 shadow-sm">
          <h3 className="text-slate-900 mb-4">Emissions by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.emissionsByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${percent}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                stroke="#ffffff"
                strokeWidth={2}
              >
                {data.emissionsByCategory.map((entry: any, index: number) => (
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
                formatter={(value: any) => [`${value.toLocaleString()} tCO₂e`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Deforestation Trend */}
        <Card className="col-span-2 p-6 bg-white border border-slate-200/60 shadow-sm">
          <h3 className="text-slate-900 mb-4">Deforestation Trend (2020-2023)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.deforestationTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value: any, name: any) => [
                  `${value.toLocaleString()} hectares`, 
                  name === 'area' ? 'Actual Deforestation' : 'Baseline Target'
                ]}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="baseline" 
                stroke="#94a3b8" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Baseline Target"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="area" 
                stroke="#ef4444" 
                strokeWidth={3}
                name="Actual Deforestation"
                dot={{ fill: '#ef4444', r: 5, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-6 p-4 bg-red-50 border border-red-200/60 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-red-900">
                  <strong>Critical Finding:</strong> Deforestation has increased 65% above baseline targets, 
                  with acceleration in 2022-2023. This directly contradicts the company's "zero deforestation" 
                  commitment made in 2020.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
