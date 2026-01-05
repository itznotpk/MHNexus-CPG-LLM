import React from 'react';
import {
  Brain,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Sparkles,
  Target,
  Check,
} from 'lucide-react';
import {
  GlassCard,
  Button,
  Badge,
  RiskBadge,
  ProbabilityBar,
  CodeBadge,
} from '../shared';
import { useApp } from '../../context/AppContext';

export function DiagnosisSection() {
  const { state, confirmDiagnosis, goToStep, selectDiagnosis } = useApp();
  const { diagnosis, isGeneratingPlan } = state;

  if (!diagnosis) return null;

  // Sort differentials by probability (highest first)
  const sortedDifferentials = [...diagnosis.differentials].sort(
    (a, b) => b.probability - a.probability
  );

  // Get the selected diagnosis (or default to highest probability)
  const selectedId = diagnosis.selectedDiagnosisId || sortedDifferentials[0]?.id;
  const selectedDiagnosis = sortedDifferentials.find((d) => d.id === selectedId);

  const handleConfirm = () => {
    confirmDiagnosis();
  };

  const handleBack = () => {
    goToStep(1);
  };

  const handleSelectDiagnosis = (diagnosisId) => {
    selectDiagnosis(diagnosisId);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          AI Risk Assessment & Diagnosis
        </h2>
        <p className="text-slate-600">
          Review and select the diagnosis to proceed with care plan generation
        </p>
      </div>

      {/* AI Suggested Diagnosis - Shows the selected one */}
      <GlassCard className="p-6 border-primary-400/50 border-2">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-500/20 rounded-xl">
              <Brain className="w-6 h-6 text-primary-700" />
            </div>
            <div>
              <span className="text-sm text-slate-600 font-medium">Selected Diagnosis</span>
              <h3 className="text-xl font-bold text-slate-800">
                {selectedDiagnosis?.name}
              </h3>
            </div>
          </div>
          <Badge 
            variant={selectedDiagnosis?.probability >= 70 ? 'success' : selectedDiagnosis?.probability >= 40 ? 'warning' : 'info'} 
            size="lg"
          >
            {selectedDiagnosis?.probability}% Probability
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <CodeBadge code={`ICD-10: ${selectedDiagnosis?.icdCode}`} />
          <RiskBadge risk={selectedDiagnosis?.risk || 'medium'} />
        </div>

        <div className="p-4 bg-amber-50/50 border border-amber-200/50 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800">Clinical Correlation Required</p>
              <p className="text-sm text-amber-700 mt-1">
                This AI-generated diagnosis should be reviewed and confirmed by the treating clinician.
                You may select an alternative diagnosis from the list below.
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Differential Diagnosis - Selectable */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-primary-500/20 rounded-xl">
            <Target className="w-5 h-5 text-primary-700" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Differential Diagnosis</h3>
            <p className="text-sm text-slate-600">Click to select a diagnosis for care plan generation</p>
          </div>
        </div>

        <div className="space-y-3">
          {sortedDifferentials.map((diff, idx) => {
            const isSelected = diff.id === selectedId;
            const isTopSuggestion = idx === 0;

            return (
              <button
                key={diff.id}
                onClick={() => handleSelectDiagnosis(diff.id)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-200 border-2 ${
                  isSelected
                    ? 'bg-primary-100/70 border-primary-500 shadow-md'
                    : 'bg-white/30 border-transparent hover:bg-white/50 hover:border-primary-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold ${
                        isSelected
                          ? 'bg-primary-600 text-white'
                          : 'bg-primary-500/20 text-slate-700'
                      }`}
                    >
                      {isSelected ? <Check className="w-4 h-4" /> : idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-800">{diff.name}</span>
                        {isTopSuggestion && (
                          <Badge variant="primary" size="sm">
                            AI Recommended
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <CodeBadge code={`ICD-10: ${diff.icdCode}`} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <RiskBadge risk={diff.risk} />
                  </div>
                </div>
                <div className="ml-9">
                  <ProbabilityBar
                    label=""
                    probability={diff.probability}
                    risk={diff.risk}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Button
          variant="secondary"
          size="lg"
          icon={RefreshCw}
          onClick={handleBack}
        >
          Revise Assessment
        </Button>
        <Button
          variant="primary"
          size="lg"
          icon={isGeneratingPlan ? null : CheckCircle}
          iconPosition="left"
          loading={isGeneratingPlan}
          onClick={handleConfirm}
          glow={!isGeneratingPlan}
          className="min-w-[280px]"
        >
          {isGeneratingPlan ? 'Generating Care Plan...' : `Confirm & Generate Care Plan`}
        </Button>
      </div>

      {isGeneratingPlan && (
        <div className="flex flex-col items-center gap-4 py-6 animate-fadeIn">
          <div className="flex items-center gap-2 text-slate-600">
            <Sparkles className="w-5 h-5 animate-pulse text-primary-600" />
            <span>AI is generating evidence-based care plan for {selectedDiagnosis?.name}...</span>
          </div>
        </div>
      )}
    </div>
  );
}
