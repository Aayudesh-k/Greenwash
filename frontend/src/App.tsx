import { useState, useEffect } from 'react';
import { SearchForm } from './components/SearchForm';
import { ExecutiveSummary } from './components/ExecutiveSummary';
import { DetailedAnalysis } from './components/DetailedAnalysis';
import { Header } from './components/Header';

export default function App() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSearch = async (companyName: string) => {
    setIsLoading(true);
    
    // Simulate API call with mock data
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock results - in production, this would come from your AI analysis backend
    const mockResults = {
      companyName,
      ticker: 'MOCK',
      industry: 'Consumer Goods',
      greenwashScore: Math.floor(Math.random() * 100),
      riskLevel: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)],
      lastUpdated: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      claims: [
        { claim: 'Net zero emissions by 2030', verified: Math.random() > 0.5, confidence: Math.floor(Math.random() * 40) + 60, status: 'Under Investigation' },
        { claim: 'Zero deforestation supply chain', verified: Math.random() > 0.5, confidence: Math.floor(Math.random() * 40) + 60, status: 'Partially Verified' },
        { claim: '100% renewable energy by 2025', verified: Math.random() > 0.5, confidence: Math.floor(Math.random() * 40) + 60, status: 'Verified' },
        { claim: 'Sustainable sourcing certification', verified: Math.random() > 0.5, confidence: Math.floor(Math.random() * 40) + 60, status: 'Disputed' },
      ],
      insights: [
        { 
          severity: 'critical',
          title: 'Supply chain data inconsistency',
          description: 'Satellite imagery shows 40% increase in deforestation activity in supplier regions, contradicting zero-deforestation claims.'
        },
        { 
          severity: 'high',
          title: 'Carbon offset verification gap',
          description: 'Carbon offset programs lack third-party verification from recognized standards (Gold Standard, Verra).'
        },
        { 
          severity: 'medium',
          title: 'Vague sustainability metrics',
          description: 'ESG report contains ambiguous targets without specific timelines or measurement frameworks.'
        },
      ],
      suppliers: [
        { id: 1, name: 'Global Palm Oil Industries', location: 'Riau, Indonesia', commodity: 'Palm Oil', riskScore: 87, emissions: 12500, deforestationLink: true, volume: 45000 },
        { id: 2, name: 'Amazon Timber Corporation', location: 'Pará, Brazil', commodity: 'Timber', riskScore: 94, emissions: 8900, deforestationLink: true, volume: 28000 },
        { id: 3, name: 'Sustainable Cocoa Cooperative', location: 'Ashanti, Ghana', commodity: 'Cocoa', riskScore: 23, emissions: 2100, deforestationLink: false, volume: 15000 },
        { id: 4, name: 'Pacific Soy Trading Ltd.', location: 'Chaco, Argentina', commodity: 'Soy', riskScore: 71, emissions: 5600, deforestationLink: true, volume: 32000 },
        { id: 5, name: 'Tropical Rubber Plantations', location: 'Sarawak, Malaysia', commodity: 'Rubber', riskScore: 68, emissions: 4200, deforestationLink: false, volume: 18000 },
        { id: 6, name: 'East African Coffee Growers', location: 'Sidamo, Ethiopia', commodity: 'Coffee', riskScore: 19, emissions: 1800, deforestationLink: false, volume: 8500 },
      ],
      commodities: [
        { name: 'Palm Oil', volume: 45000, percentOfTotal: 32, deforestationRisk: 'Critical', trend: 'increasing', emissions: 12500 },
        { name: 'Soy', volume: 32000, percentOfTotal: 23, deforestationRisk: 'High', trend: 'stable', emissions: 5600 },
        { name: 'Timber', volume: 28000, percentOfTotal: 20, deforestationRisk: 'Critical', trend: 'increasing', emissions: 8900 },
        { name: 'Rubber', volume: 18000, percentOfTotal: 13, deforestationRisk: 'Medium', trend: 'decreasing', emissions: 4200 },
        { name: 'Cocoa', volume: 15000, percentOfTotal: 11, deforestationRisk: 'Low', trend: 'stable', emissions: 2100 },
        { name: 'Coffee', volume: 8500, percentOfTotal: 6, deforestationRisk: 'Low', trend: 'decreasing', emissions: 1800 },
      ],
      quantitativeData: {
        totalEmissions: 35100,
        emissionsChange: 12.4,
        deforestationArea: 1847,
        deforestationChange: 39.8,
        waterUsage: 187500,
        waterChange: -8.2,
        wasteGenerated: 4200,
        wasteChange: 5.1,
        emissionsBySupplier: [
          { supplier: 'Global Palm Oil', emissions: 12500 },
          { supplier: 'Amazon Timber', emissions: 8900 },
          { supplier: 'Pacific Soy', emissions: 5600 },
          { supplier: 'Tropical Rubber', emissions: 4200 },
          { supplier: 'Cocoa Cooperative', emissions: 2100 },
          { supplier: 'Coffee Growers', emissions: 1800 },
        ],
        deforestationTrend: [
          { year: '2020', area: 1120, baseline: 1000 },
          { year: '2021', area: 1320, baseline: 1000 },
          { year: '2022', area: 1580, baseline: 1000 },
          { year: '2023', area: 1847, baseline: 1000 },
        ],
        emissionsByCategory: [
          { category: 'Supply Chain', value: 24500, percent: 69.8 },
          { category: 'Operations', value: 7200, percent: 20.5 },
          { category: 'Transportation', value: 2400, percent: 6.8 },
          { category: 'Other', value: 1000, percent: 2.8 },
        ],
      },
      dataSource: 'Analysis compiled from ESG reports, Trase supply chain data, Global Forest Watch satellite imagery, and third-party audit reports.',
    };
    
    setResults(mockResults);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <main className="container mx-auto px-8 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-slate-900 dark:text-slate-100 mb-2">Supply Chain Sustainability Analysis</h1>
          <p className="text-slate-600 dark:text-slate-400">
            AI-powered verification of corporate sustainability claims through real-time supply chain data analysis
          </p>
        </div>

        <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        
        {isLoading && (
          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <div className="w-1.5 h-1.5 bg-blue-600 dark:bg-emerald-500 rounded-full animate-pulse"></div>
              <p>Analyzing ESG reports and sustainability claims...</p>
            </div>
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <div className="w-1.5 h-1.5 bg-blue-600 dark:bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <p>Cross-referencing supply chain data...</p>
            </div>
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <div className="w-1.5 h-1.5 bg-blue-600 dark:bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              <p>Processing satellite imagery and deforestation data...</p>
            </div>
          </div>
        )}

        {results && !isLoading && (
          <>
            <ExecutiveSummary results={results} />
            <DetailedAnalysis results={results} />
          </>
        )}
      </main>
    </div>
  );
}
