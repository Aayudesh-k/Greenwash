import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

interface SearchFormProps {
  onSearch: (companyName: string) => void;
  isLoading: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [companyName, setCompanyName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyName.trim()) {
      onSearch(companyName.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
            <Input
              type="text"
              placeholder="Enter company name (e.g., Apple, PepsiCo, Chevron)"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="pl-12 h-12 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-emerald-300 dark:focus:border-emerald-600 focus:ring-emerald-100 dark:focus:ring-emerald-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !companyName.trim()}
            className="h-12 px-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 dark:from-emerald-500 dark:to-teal-500 dark:hover:from-emerald-600 dark:hover:to-teal-600 shadow-sm"
          >
            {isLoading ? "Analyzing..." : "Analyze"}
          </Button>
        </div>
      </div>
    </form>
  );
}
