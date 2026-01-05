import React, { useMemo } from 'react';
import { Activity, Heart, Thermometer, Wind, Droplets, Scale, Ruler } from 'lucide-react';
import { GlassCard, Input, Badge } from '../shared';
import { useApp } from '../../context/AppContext';

export function VitalsGrid() {
  const { state, dispatch, calculateBMI } = useApp();
  const { vitals } = state;

  const handleChange = (field, value) => {
    dispatch({ type: 'SET_VITALS', payload: { [field]: value } });
  };

  const bmi = useMemo(() => calculateBMI(), [vitals.weight, vitals.height]);

  const getBMICategory = (bmi) => {
    if (!bmi) return null;
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return { label: 'Underweight', variant: 'warning' };
    if (bmiValue < 25) return { label: 'Normal', variant: 'success' };
    if (bmiValue < 30) return { label: 'Overweight', variant: 'warning' };
    return { label: 'Obese', variant: 'danger' };
  };

  const bmiCategory = getBMICategory(bmi);

  const vitalFields = [
    {
      id: 'bp',
      label: 'Blood Pressure',
      icon: Heart,
      unit: 'mmHg',
      dual: true,
      fields: [
        { key: 'bpSystolic', placeholder: 'Sys' },
        { key: 'bpDiastolic', placeholder: 'Dia' },
      ],
    },
    {
      id: 'hr',
      label: 'Heart Rate',
      icon: Activity,
      unit: 'bpm',
      key: 'hr',
      placeholder: 'HR',
    },
    {
      id: 'temp',
      label: 'Temperature',
      icon: Thermometer,
      unit: '°C',
      key: 'temp',
      placeholder: 'Temp',
      step: '0.1',
    },
    {
      id: 'rr',
      label: 'Respiratory Rate',
      icon: Wind,
      unit: '/min',
      key: 'rr',
      placeholder: 'RR',
    },
    {
      id: 'spo2',
      label: 'SpO2',
      icon: Droplets,
      unit: '%',
      key: 'spo2',
      placeholder: 'SpO2',
    },
    {
      id: 'weight',
      label: 'Weight',
      icon: Scale,
      unit: 'kg',
      key: 'weight',
      placeholder: 'Weight',
      step: '0.1',
    },
    {
      id: 'height',
      label: 'Height',
      icon: Ruler,
      unit: 'cm',
      key: 'height',
      placeholder: 'Height',
    },
  ];

  return (
    <GlassCard className="p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary-500/20 rounded-xl">
          <Activity className="w-5 h-5 text-primary-700" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800">Vital Signs</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {vitalFields.map((vital) => (
          <div key={vital.id} className="space-y-1">
            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <vital.icon className="w-4 h-4 text-primary-600" />
              {vital.label}
            </label>
            {vital.dual ? (
              <div className="flex items-center gap-1">
                {vital.fields.map((field, idx) => (
                  <React.Fragment key={field.key}>
                    <input
                      type="number"
                      placeholder={field.placeholder}
                      value={vitals[field.key] || ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="w-full px-3 py-2 bg-white/50 backdrop-blur-sm border border-white/40 rounded-lg text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-primary-300 text-sm"
                    />
                    {idx === 0 && <span className="text-slate-600">/</span>}
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <div className="relative">
                <input
                  type="number"
                  step={vital.step || '1'}
                  placeholder={vital.placeholder}
                  value={vitals[vital.key] || ''}
                  onChange={(e) => handleChange(vital.key, e.target.value)}
                  className="w-full px-3 py-2 bg-white/50 backdrop-blur-sm border border-white/40 rounded-lg text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-primary-300 text-sm"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-600">
                  {vital.unit}
                </span>
              </div>
            )}
          </div>
        ))}

        {/* BMI Display */}
        <div className="space-y-1">
          <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
            <Scale className="w-4 h-4 text-primary-600" />
            BMI (Calculated)
          </label>
          <div className="flex items-center gap-2 px-3 py-2 bg-primary-100/70 rounded-lg">
            <span className="text-lg font-bold text-slate-800">
              {bmi || '--'}
            </span>
            {bmiCategory && (
              <Badge variant={bmiCategory.variant} size="sm">
                {bmiCategory.label}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
