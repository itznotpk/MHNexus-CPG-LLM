import React from 'react';
import { Menu, Bell, Settings, User, LogOut } from 'lucide-react';
import { Button } from '../shared';

export function Header() {
  return (
    <header className="glass sticky top-0 z-50 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              src="/MHNexus.png" 
              alt="MHNexus Logo" 
              className="h-10 w-auto"
            />
            <div>
              <h1 className="text-xl font-bold text-slate-800">CPG LLM</h1>
              <p className="text-xs text-slate-600 -mt-0.5">Connecting Values in Healthcare</p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-white/20 hover:scale-110 rounded-lg transition-all duration-200">
              <Bell className="w-5 h-5 text-slate-700" />
            </button>
            <button className="p-2 hover:bg-white/20 hover:scale-110 rounded-lg transition-all duration-200">
              <Settings className="w-5 h-5 text-slate-700" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-slate-400">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-slate-800 hidden sm:block">
                Dr. Ahmad
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      </div>
    </footer>
  );
}
