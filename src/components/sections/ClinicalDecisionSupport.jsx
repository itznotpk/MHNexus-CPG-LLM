import React, { useMemo } from 'react';
import {
  AlertTriangle,
  AlertCircle,
  ShieldAlert,
  Pill,
  Heart,
  Beaker,
  Calculator,
  ChevronDown,
  ChevronUp,
  Info,
  XCircle,
} from 'lucide-react';
import { GlassCard, Badge } from '../shared';
import { useApp } from '../../context/AppContext';
import {
  checkDrugInteractions,
  checkAllergyAlerts,
  checkContraindications,
  getDosageRecommendation,
  calculateEGFR,
} from '../../data/clinicalRulesData';

// Severity badge colors
const severityColors = {
  high: 'danger',
  medium: 'warning',
  low: 'info',
};

// Alert Card Component
function AlertCard({ type, icon: Icon, title, alerts, defaultOpen = true }) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  
  if (alerts.length === 0) return null;

  const highCount = alerts.filter(a => a.severity === 'high').length;
  const mediumCount = alerts.filter(a => a.severity === 'medium').length;

  return (
    <div className="bg-white/40 backdrop-blur-sm border border-white/30 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${
            highCount > 0 ? 'bg-red-100' : mediumCount > 0 ? 'bg-amber-100' : 'bg-blue-100'
          }`}>
            <Icon className={`w-5 h-5 ${
              highCount > 0 ? 'text-red-600' : mediumCount > 0 ? 'text-amber-600' : 'text-blue-600'
            }`} />
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-slate-800">{title}</h4>
            <p className="text-xs text-slate-600">{alerts.length} alert{alerts.length !== 1 ? 's' : ''} found</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {highCount > 0 && (
            <Badge variant="danger" size="sm">{highCount} High</Badge>
          )}
          {mediumCount > 0 && (
            <Badge variant="warning" size="sm">{mediumCount} Medium</Badge>
          )}
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-slate-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-500" />
          )}
        </div>
      </button>
      
      {isOpen && (
        <div className="px-4 pb-4 space-y-2">
          {alerts.map((alert, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border-l-4 ${
                alert.severity === 'high' 
                  ? 'bg-red-50/80 border-red-500' 
                  : alert.severity === 'medium'
                    ? 'bg-amber-50/80 border-amber-500'
                    : 'bg-blue-50/80 border-blue-500'
              }`}
            >
              <div className="flex items-start gap-2">
                <AlertCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                  alert.severity === 'high' ? 'text-red-600' : 
                  alert.severity === 'medium' ? 'text-amber-600' : 'text-blue-600'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-800 text-sm">
                      {alert.drugs ? alert.drugs.join(' + ') : alert.drug}
                    </span>
                    <Badge variant={severityColors[alert.severity]} size="sm">
                      {alert.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-700">{alert.description || alert.note}</p>
                  {alert.recommendation && (
                    <p className="text-xs text-slate-600 mt-1 italic">
                      💡 {alert.recommendation}
                    </p>
                  )}
                  {alert.crossReactivity && (
                    <p className="text-xs text-slate-600 mt-1 italic">
                      ⚠️ {alert.crossReactivity}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Dosage Calculator Component
function DosageCalculator({ medications, patient, vitals }) {
  const [isOpen, setIsOpen] = React.useState(true);
  
  // Calculate eGFR (mock - would need creatinine from labs)
  const mockCreatinine = 1.2; // Would come from labs
  const isFemale = patient?.gender?.toLowerCase() === 'female';
  const eGFR = calculateEGFR(mockCreatinine, patient?.age, isFemale);
  
  const recommendations = useMemo(() => {
    if (!medications || medications.length === 0) return [];
    
    return medications
      .map(med => getDosageRecommendation(med.name || med, eGFR, patient?.age, vitals?.weight))
      .filter(Boolean);
  }, [medications, eGFR, patient?.age, vitals?.weight]);

  if (recommendations.length === 0) return null;

  return (
    <div className="bg-white/40 backdrop-blur-sm border border-white/30 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-100">
            <Calculator className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-slate-800">Dosage Recommendations</h4>
            <p className="text-xs text-slate-600">
              eGFR: {eGFR || 'N/A'} mL/min/1.73m² | Age: {patient?.age || 'N/A'} | Weight: {vitals?.weight || 'N/A'} kg
            </p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-slate-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-500" />
        )}
      </button>
      
      {isOpen && (
        <div className="px-4 pb-4 space-y-2">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="p-3 bg-purple-50/80 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-800">{rec.drug}</span>
                {rec.renalAdjustment && rec.renalAdjustment !== 'none' && (
                  <Badge 
                    variant={rec.renalAdjustment === 'stop' ? 'danger' : 'warning'} 
                    size="sm"
                  >
                    {rec.renalAdjustment === 'stop' ? 'CONTRAINDICATED' : 'ADJUST DOSE'}
                  </Badge>
                )}
              </div>
              {rec.renalDose && (
                <p className="text-sm text-slate-700">
                  <span className="font-medium">Recommended:</span> {rec.renalDose}
                </p>
              )}
              {rec.ageNote && (
                <p className="text-xs text-purple-700 mt-1">
                  👴 {rec.ageNote}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Main Clinical Decision Support Panel
export function ClinicalDecisionSupport() {
  const { state } = useApp();
  const { mpisData, carePlan, patient, vitals } = state;

  // Get all medications
  const currentMeds = mpisData?.currentMeds || [];
  const newMeds = [
    ...(carePlan?.medications?.start || []),
    ...(carePlan?.medications?.continue || []),
  ];
  const allMeds = [...currentMeds, ...newMeds];
  
  // Check for issues
  const interactions = useMemo(() => 
    checkDrugInteractions(currentMeds, newMeds.map(m => m.name)),
    [currentMeds, newMeds]
  );
  
  const allergyAlerts = useMemo(() => 
    checkAllergyAlerts(mpisData?.allergies || '', allMeds),
    [mpisData?.allergies, allMeds]
  );
  
  const contraindications = useMemo(() => 
    checkContraindications(mpisData?.comorbidities || [], allMeds),
    [mpisData?.comorbidities, allMeds]
  );

  const hasAlerts = interactions.length > 0 || allergyAlerts.length > 0 || contraindications.length > 0;

  if (!carePlan) return null;

  return (
    <GlassCard className="p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-red-100 rounded-xl">
          <ShieldAlert className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Clinical Decision Support</h3>
          <p className="text-xs text-slate-600">Automated safety checks and recommendations</p>
        </div>
        {!hasAlerts && (
          <Badge variant="success" size="md" className="ml-auto">
            ✓ No Critical Alerts
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        <AlertCard
          type="interactions"
          icon={Pill}
          title="Drug-Drug Interactions"
          alerts={interactions}
        />
        
        <AlertCard
          type="allergies"
          icon={AlertTriangle}
          title="Allergy Alerts"
          alerts={allergyAlerts}
        />
        
        <AlertCard
          type="contraindications"
          icon={Heart}
          title="Contraindications"
          alerts={contraindications}
        />
        
        <DosageCalculator
          medications={newMeds}
          patient={patient}
          vitals={vitals}
        />
      </div>

      {!hasAlerts && interactions.length === 0 && (
        <div className="mt-4 p-4 bg-green-50/80 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-full">
            <Info className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-green-800">All Safety Checks Passed</p>
            <p className="text-sm text-green-700">No drug interactions, allergy alerts, or contraindications detected.</p>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
