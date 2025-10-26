import React from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Leaf, 
  Droplets, 
  Factory, 
  Users, 
  Shield, 
  TrendingUp,
  Globe,
  Heart
} from "lucide-react";

interface ThemesDisplayProps {
  themes: string[];
}

const getThemeIcon = (theme: string) => {
  const lowerTheme = theme.toLowerCase();
  
  if (lowerTheme.includes('carbon') || lowerTheme.includes('emission') || lowerTheme.includes('climate')) {
    return <Factory className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
  }
  if (lowerTheme.includes('water') || lowerTheme.includes('waste')) {
    return <Droplets className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />;
  }
  if (lowerTheme.includes('biodiversity') || lowerTheme.includes('forest') || lowerTheme.includes('nature')) {
    return <Leaf className="w-5 h-5 text-green-600 dark:text-green-400" />;
  }
  if (lowerTheme.includes('social') || lowerTheme.includes('community') || lowerTheme.includes('human')) {
    return <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
  }
  if (lowerTheme.includes('governance') || lowerTheme.includes('ethics') || lowerTheme.includes('transparency')) {
    return <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
  }
  if (lowerTheme.includes('sustainable') || lowerTheme.includes('renewable') || lowerTheme.includes('circular')) {
    return <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
  }
  if (lowerTheme.includes('health') || lowerTheme.includes('safety') || lowerTheme.includes('wellness')) {
    return <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />;
  }
  
  return <TrendingUp className="w-5 h-5 text-slate-600 dark:text-slate-400" />;
};

const getThemeColor = (theme: string) => {
  const lowerTheme = theme.toLowerCase();
  
  if (lowerTheme.includes('carbon') || lowerTheme.includes('emission') || lowerTheme.includes('climate')) {
    return "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200/60 dark:border-blue-800";
  }
  if (lowerTheme.includes('water') || lowerTheme.includes('waste')) {
    return "bg-cyan-50 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-400 border-cyan-200/60 dark:border-cyan-800";
  }
  if (lowerTheme.includes('biodiversity') || lowerTheme.includes('forest') || lowerTheme.includes('nature')) {
    return "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800";
  }
  if (lowerTheme.includes('social') || lowerTheme.includes('community') || lowerTheme.includes('human')) {
    return "bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border-purple-200/60 dark:border-purple-800";
  }
  if (lowerTheme.includes('governance') || lowerTheme.includes('ethics') || lowerTheme.includes('transparency')) {
    return "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 border-indigo-200/60 dark:border-indigo-800";
  }
  if (lowerTheme.includes('sustainable') || lowerTheme.includes('renewable') || lowerTheme.includes('circular')) {
    return "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800";
  }
  if (lowerTheme.includes('health') || lowerTheme.includes('safety') || lowerTheme.includes('wellness')) {
    return "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200/60 dark:border-red-800";
  }
  
  return "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-700";
};

export function ThemesDisplay({ themes }: ThemesDisplayProps) {
  // Debug logging
  console.log("ThemesDisplay received themes:", themes);
  
  if (!themes || themes.length === 0) {
    console.log("ThemesDisplay: No themes to display");
    return (
      <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm">
        <h3 className="text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Key ESG Themes Identified
        </h3>
        <div className="text-slate-500 dark:text-slate-400 text-center py-8">
          No ESG themes were identified in the analysis.
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm">
      <h3 className="text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
        <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        Key ESG Themes Identified
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {themes.map((theme, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-3 rounded-lg border ${getThemeColor(theme)}`}
          >
            {getThemeIcon(theme)}
            <span className="font-medium">{theme}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
