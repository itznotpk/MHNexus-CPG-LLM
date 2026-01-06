import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  AlertTriangle, 
  Play,
  User,
  Activity,
  Thermometer,
  Heart,
  Wind,
  ChevronRight,
  Bell,
  RefreshCw
} from 'lucide-react';
import { todaySchedule, dashboardStats, recentActivity } from '../../data/scheduleData';
import { GlassCard } from '../shared/GlassCard';
import { useTheme } from '../../context/ThemeContext';

const Dashboard = ({ onStartConsult }) => {
  const { isDark, accent } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [schedule, setSchedule] = useState(todaySchedule);
  const [stats, setStats] = useState(dashboardStats);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('en-MY', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = () => {
    return currentTime.toLocaleTimeString('en-MY', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      waiting: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      'in-progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      done: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    };
    const labels = {
      waiting: 'Waiting',
      'in-progress': 'In Progress',
      done: 'Done'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getBPColor = (status) => {
    const colors = {
      normal: 'text-emerald-500',
      high: 'text-amber-500',
      critical: 'text-red-600 font-bold'
    };
    return colors[status] || (isDark ? 'text-white' : 'text-slate-800');
  };

  const handleStartConsult = (appointment) => {
    // Update status to in-progress
    setSchedule(prev => prev.map(apt => 
      apt.id === appointment.id ? { ...apt, status: 'in-progress' } : apt
    ));
    // Navigate to consultation with patient data
    onStartConsult(appointment.patient, appointment.triage);
  };

  return (
    <div className="space-y-6">
      {/* Header - Greeting & Date */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {getGreeting()}, <span className={accent.text}>Dr. Sarah Chen</span>
          </h1>
          <div className={`flex items-center gap-4 mt-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate()}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {formatTime()}
            </span>
          </div>
        </div>
        <button className={`p-3 rounded-xl transition-all
          ${isDark ? 'bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white' 
                   : 'bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 hover:text-slate-800'}`}>
          <Bell className="w-5 h-5" />
        </button>
      </div>

      {/* Daily Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4" variant={isDark ? 'dark' : 'light'}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Total Appointments</p>
              <p className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>{stats.totalAppointments}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4" variant={isDark ? 'dark' : 'light'}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Patients Waiting</p>
              <p className="text-3xl font-bold text-amber-500 mt-1">{stats.patientsWaiting}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-amber-500" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4" variant={isDark ? 'dark' : 'light'}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Emergency Cases</p>
              <p className="text-3xl font-bold text-red-500 mt-1">{stats.emergencyCases}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4" variant={isDark ? 'dark' : 'light'}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>High Risk</p>
              <p className="text-3xl font-bold text-orange-500 mt-1">{stats.highRiskCases}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Activity className="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schedule Timeline - Takes 2 columns */}
        <div className="lg:col-span-2">
          <GlassCard className="p-6" variant={isDark ? 'dark' : 'light'}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                <Clock className={`w-5 h-5 ${accent.text}`} />
                Today's Schedule
              </h2>
              <button className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all
                ${isDark ? 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white' 
                         : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800'}`}>
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>

            <div className="space-y-4">
              {schedule.map((appointment, index) => (
                <div 
                  key={appointment.id}
                  className={`p-4 rounded-xl border transition-all
                    ${appointment.isEmergency 
                      ? 'bg-red-500/10 border-red-500/30 hover:bg-red-500/15' 
                      : appointment.isHighRisk
                        ? 'bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/15'
                        : isDark 
                          ? 'bg-white/5 border-white/10 hover:bg-white/10'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Time Column */}
                    <div className="flex flex-col items-center min-w-[80px]">
                      <span className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{appointment.time}</span>
                      {appointment.isEmergency && (
                        <span className="mt-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white">
                          URGENT
                        </span>
                      )}
                      {!appointment.isEmergency && appointment.isHighRisk && (
                        <span className="mt-1 px-2 py-0.5 rounded-full text-xs font-bold bg-orange-500 text-white">
                          HIGH RISK
                        </span>
                      )}
                    </div>

                    {/* Patient Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center
                          ${isDark ? 'bg-gradient-to-br from-slate-600 to-slate-700' : 'bg-gradient-to-br from-slate-300 to-slate-400'}`}>
                          <User className={`w-5 h-5 ${isDark ? 'text-slate-300' : 'text-white'}`} />
                        </div>
                        <div>
                          <h3 className={`font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>{appointment.patient.name}</h3>
                          <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            {appointment.patient.age} y/o • {appointment.patient.gender} • {appointment.patient.nsn}
                          </p>
                        </div>
                        <div className="ml-auto">
                          {getStatusBadge(appointment.status)}
                        </div>
                      </div>

                      {/* Triage Preview */}
                      <div className={`mt-3 p-3 rounded-lg ${isDark ? 'bg-black/20' : 'bg-slate-100'}`}>
                        <div className="grid grid-cols-2 gap-4">
                          {/* Vitals Snapshot */}
                          <div>
                            <p className={`text-xs uppercase mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Vitals</p>
                            <div className="flex flex-wrap gap-3 text-sm">
                              <span className={`flex items-center gap-1 font-medium ${getBPColor(appointment.triage.vitals.bpStatus)}`}>
                                <Activity className="w-3.5 h-3.5" />
                                BP: {appointment.triage.vitals.bp}
                              </span>
                              <span className={`flex items-center gap-1 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                                <Heart className="w-3.5 h-3.5 text-red-500" />
                                {appointment.triage.vitals.hr} bpm
                              </span>
                              <span className={`flex items-center gap-1 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                                <Wind className="w-3.5 h-3.5 text-blue-500" />
                                SpO2: {appointment.triage.vitals.spo2}%
                              </span>
                            </div>
                          </div>

                          {/* Chief Complaint */}
                          <div>
                            <p className={`text-xs uppercase mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Chief Complaint</p>
                            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>{appointment.triage.chiefComplaint}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex flex-col gap-2">
                      {appointment.status === 'waiting' && (
                        <button
                          onClick={() => handleStartConsult(appointment)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium
                            bg-gradient-to-r ${accent.gradient} text-white
                            hover:${accent.gradientHover} transition-all shadow-lg ${accent.shadow}`}
                        >
                          <Play className="w-4 h-4" />
                          Start Consult
                        </button>
                      )}
                      {appointment.status === 'in-progress' && (
                        <button
                          onClick={() => handleStartConsult(appointment)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium
                            bg-blue-500/20 border border-blue-500/30 text-blue-500
                            hover:bg-blue-500/30 transition-all`}
                        >
                          Continue
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                      {appointment.status === 'done' && (
                        <span className="px-4 py-2 rounded-lg text-sm text-emerald-500 bg-emerald-500/10 font-medium">
                          ✓ Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats Summary */}
          <GlassCard className="p-6" variant={isDark ? 'dark' : 'light'}>
            <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>Progress Today</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Consultations</span>
                  <span className={isDark ? 'text-white' : 'text-slate-800'}>{stats.patientsDone}/{stats.totalAppointments}</span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
                  <div 
                    className={`h-full bg-gradient-to-r ${accent.gradient} rounded-full transition-all`}
                    style={{ width: `${(stats.patientsDone / stats.totalAppointments) * 100}%` }}
                  />
                </div>
              </div>
              
              <div className={`pt-4 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                <div className="flex items-center justify-between py-2">
                  <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Completed</span>
                  <span className="text-emerald-500 font-medium">{stats.patientsDone}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>In Progress</span>
                  <span className="text-blue-500 font-medium">{stats.patientsInProgress}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Waiting</span>
                  <span className="text-amber-500 font-medium">{stats.patientsWaiting}</span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Recent Activity */}
          <GlassCard className="p-6" variant={isDark ? 'dark' : 'light'}>
            <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className={`flex items-start gap-3 py-2 border-b last:border-0 ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'plan' ? 'bg-cyan-500' :
                    activity.type === 'schedule' ? 'bg-amber-500' :
                    activity.type === 'lab' ? 'bg-purple-500' :
                    'bg-emerald-500'
                  }`} />
                  <div>
                    <p className={`text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{activity.action}</p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{activity.patient} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
