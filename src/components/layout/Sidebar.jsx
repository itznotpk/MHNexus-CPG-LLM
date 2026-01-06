import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Stethoscope
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Schedule Overview' },
  { id: 'patients', label: 'My Patients', icon: Users, description: 'Patient Registry' },
  { id: 'consultation', label: 'Add Patient', icon: UserPlus, description: 'New Consultation' },
  { id: 'settings', label: 'Settings', icon: Settings, description: 'Configuration' },
];

const Sidebar = ({ currentView, onNavigate, isCollapsed, onToggleCollapse }) => {
  const { isDark, accent } = useTheme();
  
  return (
    <aside 
      className={`fixed left-0 top-0 h-full transition-all duration-300 z-50 flex flex-col
        ${isDark 
          ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-white/10' 
          : 'bg-white border-r border-slate-200 shadow-lg'
        }
        ${isCollapsed ? 'w-20' : 'w-64'}`}
    >
      {/* Logo Section */}
      <div className={`p-4 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} ${isDark ? 'border-b border-white/10' : 'border-b border-slate-200'}`}>
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${accent.gradient}
          flex items-center justify-center shadow-lg ${accent.shadow}`}>
          <Stethoscope className="w-6 h-6 text-white" />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-800'}`}>MHNexus</span>
            <span className={`text-xs ${accent.text}`}>CPG Assistant</span>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-3 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? `bg-gradient-to-r from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20 border border-[var(--accent-primary)]/30 ${accent.text} shadow-lg ${accent.shadow}`
                  : isDark 
                    ? 'text-slate-300 hover:bg-white/5 hover:text-white' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }
                ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? item.label : ''}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? accent.text : ''}`} />
              {!isCollapsed && (
                <div className="flex flex-col items-start">
                  <span className="font-medium text-sm">{item.label}</span>
                  <span className={`text-xs ${isActive ? `${accent.text} opacity-60` : isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    {item.description}
                  </span>
                </div>
              )}
              {!isCollapsed && isActive && (
                <div className={`ml-auto w-1.5 h-8 bg-gradient-to-b ${accent.gradient} rounded-full`} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className={`p-3 ${isDark ? 'border-t border-white/10' : 'border-t border-slate-200'}`}>
        <button
          onClick={onToggleCollapse}
          className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all
            ${isDark ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>

      {/* User Profile Section */}
      {!isCollapsed && (
        <div className={`p-4 ${isDark ? 'border-t border-white/10' : 'border-t border-slate-200'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${accent.gradient}
              flex items-center justify-center text-white font-bold text-sm`}>
              SC
            </div>
            <div className="flex flex-col">
              <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>Dr. Sarah Chen</span>
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Family Medicine</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
