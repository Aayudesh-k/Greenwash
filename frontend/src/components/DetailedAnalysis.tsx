import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { SupplyChainTable } from './SupplyChainTable';
import { CommodityBreakdown } from './CommodityBreakdown';
import { EnvironmentalMetrics } from './EnvironmentalMetrics';

interface DetailedAnalysisProps {
  results: any;
}

export function DetailedAnalysis({ results }: DetailedAnalysisProps) {
  return (
    <div className="mt-8 mb-12">
      <Tabs defaultValue="supply-chain" className="w-full">
        <TabsList className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-1 h-auto shadow-sm">
          <TabsTrigger value="supply-chain" className="data-[state=active]:bg-emerald-50 dark:data-[state=active]:bg-emerald-950/50 data-[state=active]:text-emerald-900 dark:data-[state=active]:text-emerald-400">
            Supply Chain Analysis
          </TabsTrigger>
          <TabsTrigger value="commodities" className="data-[state=active]:bg-emerald-50 dark:data-[state=active]:bg-emerald-950/50 data-[state=active]:text-emerald-900 dark:data-[state=active]:text-emerald-400">
            Commodity Breakdown
          </TabsTrigger>
          <TabsTrigger value="metrics" className="data-[state=active]:bg-emerald-50 dark:data-[state=active]:bg-emerald-950/50 data-[state=active]:text-emerald-900 dark:data-[state=active]:text-emerald-400">
            Environmental Metrics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="supply-chain" className="mt-6">
          <SupplyChainTable suppliers={results.suppliers} />
        </TabsContent>

        <TabsContent value="commodities" className="mt-6">
          <CommodityBreakdown commodities={results.commodities} />
        </TabsContent>

        <TabsContent value="metrics" className="mt-6">
          <EnvironmentalMetrics data={results.quantitativeData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
