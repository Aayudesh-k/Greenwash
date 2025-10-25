import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search } from 'lucide-react';

interface SearchFormProps {
  onSearch: (companyName: string) => void;
  isLoading: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [companyName, setCompanyName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyName.trim()) {
      onSearch(companyName.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="bg-white rounded-xl border border-slate-200/60 p-6 shadow-sm">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Enter company name (e.g., Unilever, Nestlé, PepsiCo)"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="pl-12 h-12 bg-slate-50/50 border-slate-200/60 focus:bg-white focus:border-emerald-300 focus:ring-emerald-100"
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            disabled={isLoading || !companyName.trim()}
            className="h-12 px-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-sm"
          >
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </Button>
        </div>
      </div>
    </form>
  );
}
