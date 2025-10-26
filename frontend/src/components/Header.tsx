import React from "react";
import { Bell, Settings, User, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { Logo } from "./Logo";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export function Header({ darkMode, setDarkMode }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="w-9 h-9" />
            <div>
              <div className="text-slate-900 dark:text-slate-100">
                Green Watch
              </div>
              <div className="text-slate-500 dark:text-slate-400">
                Analytics
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
