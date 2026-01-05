import React from 'react';
import { Stethoscope, Sparkles, Brain, FileText, Activity } from 'lucide-react';
import { PatientDemographics } from './PatientDemographics';
import { ClinicalNotes } from './ClinicalNotes';
import { VitalsGrid } from './VitalsGrid';
import { MPISSync } from './MPISSync';
import { Button, Skeleton, SkeletonDiagnosis } from '../shared';
import { useApp } from '../../context/AppContext';

// Analyzing Skeleton Component
function AnalyzingSkeleton() {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Progress indicator */}
      <div className="bg-white/40 backdrop-blur-xl border border-white/30 rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-primary-500/20 rounded-xl">
            <Brain className="w-6 h-6 text-primary-600 animate-pulse" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-800 mb-1">AI Analysis in Progress</h3>
            <p className="text-sm text-slate-600">Processing clinical data and generating diagnosis...</p>
          </div>
        </div>
        
        {/* Progress steps */}
        <div className="space-y-3">
          <AnalysisStep label="Parsing clinical notes" status="complete" />
          <AnalysisStep label="Analyzing symptoms and findings" status="active" />
          <AnalysisStep label="Cross-referencing with CPG guidelines" status="pending" />
          <AnalysisStep label="Generating differential diagnosis" status="pending" />
        </div>
      </div>
      
      {/* Skeleton preview of what's coming */}
      <SkeletonDiagnosis />
    </div>
  );
}

function AnalysisStep({ label, status }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
        status === 'complete' ? 'bg-green-500' :
        status === 'active' ? 'bg-primary-500 animate-pulse' :
        'bg-slate-200'
      }`}>
        {status === 'complete' && (
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
        {status === 'active' && (
          <div className="w-2 h-2 bg-white rounded-full" />
        )}
      </div>
      <span className={`text-sm ${
        status === 'complete' ? 'text-green-700 font-medium' :
        status === 'active' ? 'text-primary-700 font-medium' :
        'text-slate-500'
      }`}>
        {label}
        {status === 'active' && <span className="ml-2 animate-pulse">...</span>}
      </span>
    </div>
  );
}

export function DataInputSection() {
  const { state, analyzeAssessment } = useApp();
  const { isAnalyzing, clinicalNotes, mpisSynced } = state;

  const canAnalyze = clinicalNotes.trim().length > 0;

  const handleAnalyze = () => {
    analyzeAssessment();
  };

  // Show skeleton loader when analyzing
  if (isAnalyzing) {
    return <AnalyzingSkeleton />;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Clinical Assessment Input
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PatientDemographics />
        <MPISSync />
      </div>

      <ClinicalNotes />
      <VitalsGrid />

      <div className="flex justify-center pt-4">
        <Button
          variant="primary"
          size="xl"
          icon={Stethoscope}
          disabled={!canAnalyze}
          onClick={handleAnalyze}
          glow={canAnalyze}
          className="min-w-[300px]"
        >
          Analyze Clinical Assessment
        </Button>
      </div>
    </div>
  );
}
