import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Heart, Activity, Thermometer, Wind, Scale, Droplets } from 'lucide-react';
import { GlassCard, GlassPanel, Button, Badge } from '../shared';
import { VitalsLineChart } from '../shared/VitalsLineChart';
import { useTheme } from '../../context/ThemeContext';
import { mpisPatientDatabase } from '../../data/sampleData';

// Tab configuration for vital signs
const vitalsTabs = [
    {
        id: 'bloodPressure',
        label: 'Blood Pressure',
        icon: Heart,
        metrics: [
            { key: 'bpSystolic', label: 'Systolic', unit: 'mmHg', color: '#ef4444' },
            { key: 'bpDiastolic', label: 'Diastolic', unit: 'mmHg', color: '#f97316' },
        ]
    },
    {
        id: 'heartRate',
        label: 'Heart Rate',
        icon: Activity,
        metrics: [
            { key: 'hr', label: 'Heart Rate', unit: 'bpm', color: '#8b5cf6' },
        ]
    },
    {
        id: 'oxygenation',
        label: 'SpO2',
        icon: Wind,
        metrics: [
            { key: 'spo2', label: 'Oxygen Saturation', unit: '%', color: '#3b82f6' },
        ]
    },
    {
        id: 'weight',
        label: 'Weight',
        icon: Scale,
        metrics: [
            { key: 'weight', label: 'Weight', unit: 'kg', color: '#10b981' },
        ]
    },
    {
        id: 'temperature',
        label: 'Temperature',
        icon: Thermometer,
        metrics: [
            { key: 'temp', label: 'Temperature', unit: '°C', color: '#f59e0b' },
        ]
    },
];

function PatientChart({ patient, onBack }) {
    const { isDark } = useTheme();
    const [activeTab, setActiveTab] = useState('bloodPressure');
    const [vitalsData, setVitalsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Get MPIS data for this patient if available
    const patientNric = patient?.nsn || patient?.nric;
    const mpisRecord = patientNric ? mpisPatientDatabase[patientNric] : null;

    // Auto-load historical data on mount
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);

            // Simulate brief loading for smooth UX
            await new Promise(resolve => setTimeout(resolve, 500));

            // Load historical data from MPIS or generate sample
            if (mpisRecord?.mpisData?.vitalsHistory) {
                setVitalsData(mpisRecord.mpisData.vitalsHistory);
            } else {
                // Generate sample history for patients without MPIS data
                const sampleHistory = generateSampleHistory();
                setVitalsData(sampleHistory);
            }

            setIsLoading(false);
        };

        loadData();
    }, [patientNric]);

    // Generate sample history for patients without MPIS data
    const generateSampleHistory = () => {
        const history = [];
        const today = new Date();
        for (let i = 11; i >= 0; i--) {
            const date = new Date(today);
            date.setMonth(date.getMonth() - i);
            history.push({
                date: date.toISOString().split('T')[0],
                bpSystolic: 120 + Math.floor(Math.random() * 30),
                bpDiastolic: 75 + Math.floor(Math.random() * 20),
                hr: 65 + Math.floor(Math.random() * 20),
                temp: 36.2 + Math.random() * 0.8,
                spo2: 95 + Math.floor(Math.random() * 4),
                weight: 70 + Math.floor(Math.random() * 10),
            });
        }
        return history;
    };

    const currentTabConfig = vitalsTabs.find(t => t.id === activeTab);
    const latestVitals = vitalsData.length > 0 ? vitalsData[vitalsData.length - 1] : null;

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={onBack}>
                    Back
                </Button>
                <div>
                    <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Patient Chart
                    </h1>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Vital Signs History
                    </p>
                </div>
            </div>

            {/* Patient Info Card */}
            <GlassCard className="p-5">
                <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isDark ? 'bg-[var(--accent-primary)]/20' : 'bg-[var(--accent-primary)]/10'
                        }`}>
                        <User className="w-8 h-8 text-[var(--accent-primary)]" />
                    </div>
                    <div className="flex-1">
                        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            {patient?.name || 'Unknown Patient'}
                        </h2>
                        <div className="flex flex-wrap gap-4 mt-1">
                            <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                <strong>NRIC:</strong> {patientNric || 'N/A'}
                            </span>
                            <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                <strong>Age:</strong> {patient?.age || 'N/A'} years
                            </span>
                            <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                <strong>Gender:</strong> {patient?.gender || 'N/A'}
                            </span>
                        </div>
                    </div>
                    {mpisRecord && (
                        <div className="flex flex-wrap gap-2">
                            {mpisRecord.mpisData.comorbidities?.slice(0, 3).map((condition, i) => (
                                <Badge key={i} variant="warning" size="sm">{condition}</Badge>
                            ))}
                        </div>
                    )}
                </div>
            </GlassCard>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {vitalsTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${isActive
                                ? 'bg-[var(--accent-primary)] text-white shadow-lg'
                                : isDark
                                    ? 'bg-white/10 text-slate-300 hover:bg-white/20'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Vital Signs Chart */}
            <GlassPanel className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[var(--accent-primary)]/20 rounded-xl">
                            {currentTabConfig && <currentTabConfig.icon className="w-5 h-5 text-[var(--accent-primary)]" />}
                        </div>
                        <div>
                            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {currentTabConfig?.label} Trends
                            </h3>
                            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                {isLoading
                                    ? 'Loading historical data...'
                                    : `Showing ${vitalsData.length} data points from MPIS history`
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--accent-primary)] border-t-transparent" />
                    </div>
                ) : (
                    <VitalsLineChart
                        data={vitalsData}
                        metrics={currentTabConfig?.metrics || []}
                        height={350}
                    />
                )}
            </GlassPanel>

            {/* Quick Stats for Current Tab */}
            {!isLoading && latestVitals && currentTabConfig && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {currentTabConfig.metrics.map((metric) => {
                        const values = vitalsData.map(d => d[metric.key]).filter(v => v !== undefined);
                        const latest = latestVitals[metric.key];
                        const min = Math.min(...values);
                        const max = Math.max(...values);
                        const avg = values.reduce((a, b) => a + b, 0) / values.length;

                        return (
                            <React.Fragment key={metric.key}>
                                <GlassCard className="p-4 text-center">
                                    <div className={`text-xs font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        Latest
                                    </div>
                                    <div className="text-2xl font-bold" style={{ color: metric.color }}>
                                        {latest?.toFixed(metric.key === 'temp' ? 1 : 0) || '-'}
                                    </div>
                                    <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                        {metric.unit}
                                    </div>
                                </GlassCard>
                                <GlassCard className="p-4 text-center">
                                    <div className={`text-xs font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        Average
                                    </div>
                                    <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                        {avg?.toFixed(metric.key === 'temp' ? 1 : 0) || '-'}
                                    </div>
                                    <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                        {metric.unit}
                                    </div>
                                </GlassCard>
                                <GlassCard className="p-4 text-center">
                                    <div className={`text-xs font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        Min
                                    </div>
                                    <div className={`text-2xl font-bold text-green-500`}>
                                        {min?.toFixed(metric.key === 'temp' ? 1 : 0) || '-'}
                                    </div>
                                    <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                        {metric.unit}
                                    </div>
                                </GlassCard>
                                <GlassCard className="p-4 text-center">
                                    <div className={`text-xs font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        Max
                                    </div>
                                    <div className={`text-2xl font-bold text-red-500`}>
                                        {max?.toFixed(metric.key === 'temp' ? 1 : 0) || '-'}
                                    </div>
                                    <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                        {metric.unit}
                                    </div>
                                </GlassCard>
                            </React.Fragment>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default PatientChart;
