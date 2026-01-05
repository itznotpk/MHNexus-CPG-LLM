import React, { useState } from 'react';
import {
  CheckCircle,
  Download,
  Eye,
  FileText,
  RefreshCw,
  Printer,
  Share2,
  ChevronDown,
  ChevronUp,
  Pill,
  Stethoscope,
  FlaskConical,
  Calendar,
  Check,
  X,
  User,
} from 'lucide-react';
import { GlassCard, Button, Badge } from '../shared';
import { useApp } from '../../context/AppContext';
import { generateCarePlanPDF } from '../../utils/pdfGenerator';

// Summary Sidebar Component
function PlanSummary({ carePlan, patient }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const acceptedMedsStop = carePlan.medications.stop.filter((m) => m.accepted);
  const acceptedMedsStart = carePlan.medications.start.filter((m) => m.accepted);
  const acceptedInterventions = carePlan.interventions.filter((i) => i.accepted);
  const acceptedInvestigations = carePlan.investigations.filter((i) => i.accepted);

  return (
    <GlassCard className="p-5">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/20 rounded-xl">
            <FileText className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">Plan Summary</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-slate-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-600" />
        )}
      </button>

      {isExpanded && (
        <div className="space-y-4 animate-fadeIn">
          {/* Patient Info */}
          <div className="p-3 bg-primary-100/70 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-primary-700" />
              <span className="font-medium text-slate-800">{patient.name || 'Patient'}</span>
            </div>
            <p className="text-sm text-slate-600">
              {patient.age ? `${patient.age} years old` : ''} {patient.gender ? `• ${patient.gender}` : ''}
            </p>
          </div>

          {/* Medication Changes */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Pill className="w-4 h-4 text-primary-700" />
              <span className="font-medium text-slate-800">Medication Changes</span>
            </div>
            <div className="space-y-1 pl-6">
              {acceptedMedsStop.map((med) => (
                <div key={med.id} className="flex items-center gap-2 text-sm">
                  <X className="w-3 h-3 text-red-600" />
                  <span className="text-red-800 font-medium">Stop {med.name}</span>
                </div>
              ))}
              {acceptedMedsStart.map((med) => (
                <div key={med.id} className="flex items-center gap-2 text-sm">
                  <Check className="w-3 h-3 text-green-600" />
                  <span className="text-green-800 font-medium">Start {med.name} {med.dose}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interventions */}
          {acceptedInterventions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Stethoscope className="w-4 h-4 text-primary-700" />
                <span className="font-medium text-slate-800">Interventions</span>
              </div>
              <div className="space-y-1 pl-6">
                {acceptedInterventions.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 text-sm">
                    <Check className="w-3 h-3 text-green-600" />
                    <span className="text-slate-700">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Investigations */}
          {acceptedInvestigations.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FlaskConical className="w-4 h-4 text-primary-700" />
                <span className="font-medium text-slate-800">Investigations</span>
              </div>
              <div className="flex flex-wrap gap-1 pl-6">
                {acceptedInvestigations.map((item) => (
                  <Badge key={item.id} variant="outline" size="sm">
                    {item.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Follow-up */}
          <div className="p-3 bg-blue-50/50 rounded-xl">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-800">
                Follow-up: {carePlan.disposition.followUp}
              </span>
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
}

// Main Output Section
export function OutputSection() {
  const { state, resetApp, goToStep } = useApp();
  const { patient, carePlan, diagnosis } = state;
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  // Get the selected diagnosis from the differentials array
  const selectedDiagnosis = diagnosis?.differentials?.find(
    (d) => d.id === diagnosis?.selectedDiagnosisId
  ) || diagnosis?.differentials?.[0];

  const handleNewAssessment = () => {
    resetApp();
  };

  const handleViewChart = () => {
    goToStep(3);
  };

  const handleExportPDF = () => {
    generateCarePlanPDF({
      patient,
      diagnosis,
      carePlan,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Success Banner */}
      <GlassCard variant="success" className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-green-500/20 rounded-full">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-green-800">
                Care Plan Successfully Generated & Saved
              </h2>
              <p className="text-green-700 mt-1">
                The evidence-based care plan has been saved to the patient's chart.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success" size="lg">
              Saved at {new Date().toLocaleTimeString()}
            </Badge>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Action Tools */}
          <GlassCard className="p-5">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                variant="primary"
                size="md"
                icon={Download}
                onClick={handleExportPDF}
                className="w-full"
              >
                Export PDF
              </Button>
              <Button
                variant="secondary"
                size="md"
                icon={Printer}
                onClick={handlePrint}
                className="w-full"
              >
                Print
              </Button>
              <Button
                variant="secondary"
                size="md"
                icon={Eye}
                onClick={handleViewChart}
                className="w-full"
              >
                View Plan
              </Button>
              <Button
                variant="secondary"
                size="md"
                icon={Share2}
                onClick={() => {}}
                className="w-full"
              >
                Share
              </Button>
            </div>
          </GlassCard>

          {/* Diagnosis Summary */}
          <GlassCard className="p-5">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Diagnosis Summary</h3>
            <div className="p-4 bg-white/50 rounded-xl">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-slate-800">
                    {selectedDiagnosis?.name}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    ICD-10: {selectedDiagnosis?.icdCode}
                  </p>
                </div>
                <Badge 
                  variant={selectedDiagnosis?.risk === 'high' ? 'danger' : selectedDiagnosis?.risk === 'medium' ? 'warning' : 'success'} 
                  size="md"
                >
                  {selectedDiagnosis?.risk?.charAt(0).toUpperCase() + selectedDiagnosis?.risk?.slice(1)} Risk
                </Badge>
              </div>
            </div>
          </GlassCard>

          {/* Key Recommendations */}
          <GlassCard className="p-5">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Key Recommendations</h3>
            <div className="space-y-3">
              <div className="p-4 bg-red-50/80 rounded-xl border-l-4 border-red-500">
                <span className="text-xs font-bold text-red-700 uppercase">Stop Medication</span>
                <p className="font-medium text-slate-800 mt-1">
                  Glipizide 5mg OD - Replacing with SGLT2i
                </p>
              </div>
              <div className="p-4 bg-green-50/80 rounded-xl border-l-4 border-green-500">
                <span className="text-xs font-bold text-green-700 uppercase">Start Medications</span>
                <p className="font-medium text-slate-800 mt-1">
                  Empagliflozin 10mg OD, Lisinopril 5mg OD
                </p>
              </div>
              <div className="p-4 bg-blue-50/80 rounded-xl border-l-4 border-blue-500">
                <span className="text-xs font-bold text-blue-700 uppercase">Referral</span>
                <p className="font-medium text-slate-800 mt-1">
                  Ophthalmology for diabetic retinopathy screening
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <PlanSummary carePlan={carePlan} patient={patient} />

          {/* New Assessment Button */}
          <Button
            variant="outline"
            size="lg"
            icon={RefreshCw}
            onClick={handleNewAssessment}
            className="w-full"
          >
            Start New Assessment
          </Button>
        </div>
      </div>
    </div>
  );
}
