import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Database,
  Save,
  Camera,
  Mail,
  Phone,
  Building,
  Award,
  Clock,
  Moon,
  Sun,
  Monitor,
  Check
} from 'lucide-react';
import { GlassCard } from '../shared/GlassCard';
import { useTheme, accentColors } from '../../context/ThemeContext';

const Settings = () => {
  const { theme, setTheme, accentColor, setAccentColor, effectiveTheme, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    emergencyAlerts: true
  });

  const [profile, setProfile] = useState({
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@mhnexus.com',
    phone: '+60 12-345 6789',
    specialty: 'Family Medicine',
    license: 'MMC-12345',
    facility: 'Hospital Kuala Lumpur',
    department: 'Primary Care Unit'
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'system', label: 'System', icon: Database }
  ];

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="flex items-start gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 
            flex items-center justify-center text-white text-2xl font-bold">
            SC
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-slate-700 
            border-2 border-slate-800 flex items-center justify-center text-white
            hover:bg-slate-600 transition-colors">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
                  text-white focus:outline-none focus:border-cyan-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Specialty</label>
              <input
                type="text"
                value={profile.specialty}
                onChange={(e) => setProfile({ ...profile, specialty: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
                  text-white focus:outline-none focus:border-cyan-500/50 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-slate-400 mb-2 flex items-center gap-2">
            <Mail className="w-4 h-4" /> Email
          </label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
              text-white focus:outline-none focus:border-cyan-500/50 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2 flex items-center gap-2">
            <Phone className="w-4 h-4" /> Phone
          </label>
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
              text-white focus:outline-none focus:border-cyan-500/50 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2 flex items-center gap-2">
            <Award className="w-4 h-4" /> Medical License
          </label>
          <input
            type="text"
            value={profile.license}
            onChange={(e) => setProfile({ ...profile, license: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
              text-white focus:outline-none focus:border-cyan-500/50 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2 flex items-center gap-2">
            <Building className="w-4 h-4" /> Facility
          </label>
          <input
            type="text"
            value={profile.facility}
            onChange={(e) => setProfile({ ...profile, facility: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
              text-white focus:outline-none focus:border-cyan-500/50 transition-all"
          />
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <p className="text-slate-400">Configure how you receive notifications and alerts.</p>
      
      <div className="space-y-4">
        {[
          { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
          { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications' },
          { key: 'sms', label: 'SMS Alerts', desc: 'Text message notifications' },
          { key: 'emergencyAlerts', label: 'Emergency Alerts', desc: 'Critical patient alerts (always on)' }
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
            <div>
              <p className="text-white font-medium">{item.label}</p>
              <p className="text-sm text-slate-400">{item.desc}</p>
            </div>
            <button
              onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
              className={`w-12 h-6 rounded-full transition-all relative
                ${notifications[item.key] ? 'bg-cyan-500' : 'bg-slate-600'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all
                ${notifications[item.key] ? 'left-7' : 'left-1'}`} 
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
        Customize the appearance of your workspace. Changes are applied immediately and saved automatically.
      </p>
      
      <div>
        <label className={`block text-sm font-medium mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          Theme
        </label>
        <div className="grid grid-cols-3 gap-4">
          {[
            { id: 'light', label: 'Light', icon: Sun, desc: 'Bright and clean' },
            { id: 'dark', label: 'Dark', icon: Moon, desc: 'Easy on the eyes' },
            { id: 'system', label: 'System', icon: Monitor, desc: 'Match your OS' }
          ].map((t) => {
            const Icon = t.icon;
            const isActive = theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 relative
                  ${isActive 
                    ? `border-[var(--accent-primary)] bg-[var(--accent-primary)]/10` 
                    : `${isDark ? 'bg-white/5 border-white/10 hover:border-white/30' : 'bg-slate-100 border-slate-200 hover:border-slate-400'}`
                  }`}
              >
                {isActive && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[var(--accent-primary)] flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <Icon className={`w-8 h-8 ${isActive ? 'text-[var(--accent-primary)]' : isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                <span className={`text-sm font-semibold ${isActive ? 'text-[var(--accent-primary)]' : isDark ? 'text-white' : 'text-slate-800'}`}>
                  {t.label}
                </span>
                <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{t.desc}</span>
              </button>
            );
          })}
        </div>
        <p className={`text-xs mt-2 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
          Current: {effectiveTheme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </p>
      </div>

      <div>
        <label className={`block text-sm font-medium mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          Accent Color
        </label>
        <div className="flex flex-wrap gap-3">
          {Object.entries(accentColors).map(([key, color]) => {
            const isActive = accentColor === key;
            return (
              <button
                key={key}
                onClick={() => setAccentColor(key)}
                className={`w-12 h-12 rounded-full transition-all flex items-center justify-center
                  ring-2 ring-offset-2 ${isDark ? 'ring-offset-slate-900' : 'ring-offset-white'}
                  ${isActive ? `ring-[${color.primary}]` : 'ring-transparent hover:ring-slate-400'}
                  ${color.bg}`}
                title={color.name}
              >
                {isActive && <Check className="w-5 h-5 text-white" />}
              </button>
            );
          })}
        </div>
        <p className={`text-xs mt-2 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
          Selected: {accentColors[accentColor]?.name || 'Cyan'}
        </p>
      </div>

      {/* Live Preview */}
      <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-slate-100'} border ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
        <p className={`text-sm font-medium mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Preview</p>
        <div className="flex items-center gap-3">
          <button className={`px-4 py-2 rounded-lg text-white font-medium bg-gradient-to-r ${accentColors[accentColor]?.gradient}`}>
            Primary Button
          </button>
          <button className={`px-4 py-2 rounded-lg font-medium border ${accentColors[accentColor]?.text} ${accentColors[accentColor]?.border} bg-transparent`}>
            Secondary
          </button>
          <span className={`px-3 py-1 rounded-full text-sm ${accentColors[accentColor]?.bg}/20 ${accentColors[accentColor]?.text}`}>
            Badge
          </span>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <p className="text-slate-400">System configuration and data management.</p>
      
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-white font-medium">MPIS Integration</p>
                <p className="text-sm text-slate-400">Malaysian Patient Information System</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Connected
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-white font-medium">Security</p>
                <p className="text-sm text-slate-400">Two-factor authentication enabled</p>
              </div>
            </div>
            <button className="px-3 py-1.5 rounded-lg text-sm bg-white/5 text-slate-300 
              hover:bg-white/10 border border-white/10 transition-all">
              Manage
            </button>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-white font-medium">Language & Region</p>
                <p className="text-sm text-slate-400">English (Malaysia)</p>
              </div>
            </div>
            <button className="px-3 py-1.5 rounded-lg text-sm bg-white/5 text-slate-300 
              hover:bg-white/10 border border-white/10 transition-all">
              Change
            </button>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-white font-medium">Session Timeout</p>
                <p className="text-sm text-slate-400">Auto-logout after 30 minutes of inactivity</p>
              </div>
            </div>
            <select className="px-3 py-1.5 rounded-lg text-sm bg-white/5 text-slate-300 
              border border-white/10 focus:outline-none focus:border-cyan-500/50">
              <option value="15">15 mins</option>
              <option value="30" selected>30 mins</option>
              <option value="60">1 hour</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your profile and system preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs Sidebar */}
        <GlassCard className="p-4 lg:col-span-1 h-fit">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left
                    ${activeTab === tab.id
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </GlassCard>

        {/* Settings Content */}
        <GlassCard className="p-6 lg:col-span-3">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white capitalize">{activeTab} Settings</h2>
          </div>

          {activeTab === 'profile' && renderProfileSettings()}
          {activeTab === 'notifications' && renderNotificationSettings()}
          {activeTab === 'appearance' && renderAppearanceSettings()}
          {activeTab === 'system' && renderSystemSettings()}

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-white/10">
            <button className="px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-colors">
              Cancel
            </button>
            <button className="flex items-center gap-2 px-6 py-2 rounded-lg font-medium
              bg-gradient-to-r from-cyan-500 to-blue-500 text-white
              hover:from-cyan-400 hover:to-blue-400 transition-all">
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Settings;
