import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  UserPlus, 
  FileText, 
  Calendar,
  ChevronRight,
  User,
  Phone,
  Mail,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw
} from 'lucide-react';
import { patientRegistry } from '../../data/scheduleData';
import { GlassCard } from '../shared/GlassCard';
import { useTheme } from '../../context/ThemeContext';

const MyPatients = ({ onViewChart, onNewPatient }) => {
  const { isDark, accent } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, discharged, follow-up
  const [patients, setPatients] = useState(patientRegistry);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.nsn.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const config = {
      active: { bg: 'bg-emerald-500/20', text: 'text-emerald-500', border: 'border-emerald-500/30', icon: CheckCircle, label: 'Active' },
      discharged: { bg: 'bg-slate-500/20', text: isDark ? 'text-slate-300' : 'text-slate-600', border: 'border-slate-500/30', icon: XCircle, label: 'Discharged' },
      'follow-up': { bg: 'bg-amber-500/20', text: 'text-amber-500', border: 'border-amber-500/30', icon: RotateCcw, label: 'Follow-up Required' }
    };
    const cfg = config[status];
    const Icon = cfg.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
        <Icon className="w-3 h-3" />
        {cfg.label}
      </span>
    );
  };

  const getRiskBadge = (level) => {
    const config = {
      low: { bg: 'bg-emerald-500/20', text: 'text-emerald-500' },
      moderate: { bg: 'bg-amber-500/20', text: 'text-amber-500' },
      high: { bg: 'bg-orange-500/20', text: 'text-orange-500' },
      critical: { bg: 'bg-red-500/20', text: 'text-red-600 font-bold' }
    };
    const cfg = config[level];
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
        {level.charAt(0).toUpperCase() + level.slice(1)} Risk
      </span>
    );
  };

  const statusCounts = {
    all: patients.length,
    active: patients.filter(p => p.status === 'active').length,
    'follow-up': patients.filter(p => p.status === 'follow-up').length,
    discharged: patients.filter(p => p.status === 'discharged').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>My Patients</h1>
          <p className={`mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Manage your patient registry and follow-ups</p>
        </div>
        <button
          onClick={onNewPatient}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium
            bg-gradient-to-r ${accent.gradient} text-white
            transition-all shadow-lg ${accent.shadow}`}
        >
          <UserPlus className="w-5 h-5" />
          New Patient
        </button>
      </div>

      {/* Search and Filter Bar */}
      <GlassCard className="p-4" variant={isDark ? 'dark' : 'light'}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            <input
              type="text"
              placeholder="Search by name or NSN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border transition-all
                ${isDark 
                  ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-[var(--accent-primary)]/50' 
                  : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-[var(--accent-primary)]'
                } focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20`}
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-2">
            {[
              { key: 'all', label: 'All' },
              { key: 'active', label: 'Active' },
              { key: 'follow-up', label: 'Follow-up' },
              { key: 'discharged', label: 'Discharged' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${statusFilter === tab.key
                    ? `bg-[var(--accent-primary)]/20 ${accent.text} border border-[var(--accent-primary)]/30`
                    : isDark 
                      ? 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-transparent'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 border border-transparent'
                  }`}
              >
                {tab.label} ({statusCounts[tab.key]})
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Patient List */}
      <GlassCard className="overflow-hidden" variant={isDark ? 'dark' : 'light'}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                <th className={`text-left p-4 text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Patient</th>
                <th className={`text-left p-4 text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>NSN</th>
                <th className={`text-left p-4 text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Status</th>
                <th className={`text-left p-4 text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Diagnoses</th>
                <th className={`text-left p-4 text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Next Review (TCA)</th>
                <th className={`text-left p-4 text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Risk</th>
                <th className={`text-right p-4 text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr 
                  key={patient.id}
                  className={`border-b transition-colors cursor-pointer
                    ${isDark ? 'border-white/5 hover:bg-white/5' : 'border-slate-100 hover:bg-slate-50'}`}
                  onClick={() => setSelectedPatient(selectedPatient?.id === patient.id ? null : patient)}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center
                        ${isDark ? 'bg-gradient-to-br from-slate-600 to-slate-700' : 'bg-gradient-to-br from-slate-300 to-slate-400'}`}>
                        <User className={`w-5 h-5 ${isDark ? 'text-slate-300' : 'text-white'}`} />
                      </div>
                      <div>
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>{patient.name}</p>
                        <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{patient.age} y/o • {patient.gender}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-sm font-mono ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{patient.nsn}</span>
                  </td>
                  <td className="p-4">
                    {getStatusBadge(patient.status)}
                  </td>
                  <td className="p-4">
                    <div className="max-w-xs">
                      <p className={`text-sm truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>{patient.diagnoses[0]}</p>
                      {patient.diagnoses.length > 1 && (
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>+{patient.diagnoses.length - 1} more</p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    {patient.nextReview ? (
                      <div className="flex items-center gap-2">
                        <Calendar className={`w-4 h-4 ${accent.text}`} />
                        <div>
                          <p className={`text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{patient.nextReview}</p>
                          <p className={`text-xs font-medium ${patient.tcaDays <= 3 ? 'text-amber-500' : isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            TCA: {patient.tcaDays} {patient.tcaDays === 1 ? 'Day' : 'Days'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <span className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>—</span>
                    )}
                  </td>
                  <td className="p-4">
                    {getRiskBadge(patient.riskLevel)}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewChart && onViewChart(patient);
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all
                        ${isDark 
                          ? 'bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200'}`}
                    >
                      <FileText className="w-4 h-4" />
                      View Chart
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPatients.length === 0 && (
          <div className="p-12 text-center">
            <AlertCircle className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>No patients found matching your criteria</p>
          </div>
        )}
      </GlassCard>

      {/* Patient Detail Panel (Expandable) */}
      {selectedPatient && (
        <GlassCard className="p-6" variant={isDark ? 'dark' : 'light'}>
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${accent.gradient}
                flex items-center justify-center text-white text-xl font-bold`}>
                {selectedPatient.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{selectedPatient.name}</h2>
                <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                  {selectedPatient.age} years old • {selectedPatient.gender} • {selectedPatient.nsn}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  {getStatusBadge(selectedPatient.status)}
                  {getRiskBadge(selectedPatient.riskLevel)}
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedPatient(null)}
              className={`${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'} transition-colors`}
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Contact Info */}
            <div className="space-y-3">
              <h3 className={`text-sm font-medium uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Contact</h3>
              <div className="space-y-2">
                <p className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  <Phone className={`w-4 h-4 ${accent.text}`} />
                  {selectedPatient.phone}
                </p>
                <p className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  <Mail className={`w-4 h-4 ${accent.text}`} />
                  {selectedPatient.email}
                </p>
              </div>
            </div>

            {/* Diagnoses */}
            <div className="space-y-3">
              <h3 className={`text-sm font-medium uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Diagnoses</h3>
              <div className="space-y-2">
                {selectedPatient.diagnoses.map((dx, i) => (
                  <p key={i} className={`text-sm flex items-start gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    <span className={`mt-0.5 ${accent.text}`}>•</span>
                    {dx}
                  </p>
                ))}
              </div>
            </div>

            {/* Visit Info */}
            <div className="space-y-3">
              <h3 className={`text-sm font-medium uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Visit Info</h3>
              <div className="space-y-2">
                <p className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  <Clock className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                  Last Visit: {selectedPatient.lastVisit}
                </p>
                {selectedPatient.nextReview && (
                  <p className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    <Calendar className={`w-4 h-4 ${accent.text}`} />
                    Next Review: {selectedPatient.nextReview}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className={`flex items-center gap-3 mt-6 pt-6 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
            <button
              onClick={() => onViewChart && onViewChart(selectedPatient)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium
                bg-gradient-to-r ${accent.gradient} text-white transition-all`}
            >
              <FileText className="w-4 h-4" />
              View Full Chart
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                ${isDark 
                  ? 'bg-white/5 text-white hover:bg-white/10 border border-white/10' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'}`}
            >
              <Calendar className="w-4 h-4" />
              Schedule Follow-up
            </button>
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default MyPatients;
