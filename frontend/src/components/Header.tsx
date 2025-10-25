import { Bell, Settings, User } from 'lucide-react';
import { Button } from './ui/button';
import { Logo } from './Logo';

export function Header() {
  return (
    <header className="bg-white border-b border-slate-200/60 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-8 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="w-9 h-9" />
            <div>
              <div className="text-slate-900">GreenWash</div>
              <div className="text-slate-500">Analytics</div>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-1">
            <a href="#" className="px-4 py-2 text-slate-900 rounded-lg bg-slate-50">Dashboard</a>
            <a href="#" className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">Reports</a>
            <a href="#" className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">API</a>
            <a href="#" className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">Docs</a>
          </nav>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900 hover:bg-slate-50">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900 hover:bg-slate-50">
              <Settings className="w-5 h-5" />
            </Button>
            <div className="w-9 h-9 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center ml-2">
              <User className="w-4 h-4 text-slate-600" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
