import React, { useState } from 'react';
import {
  ClipboardList,
  Stethoscope,
  Pill,
  Activity,
  FlaskConical,
  Calendar,
  BookOpen,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  FileText,
  AlertCircle,
  Plus,
  Minus,
  ArrowRight,
  Shield,
} from 'lucide-react';
import {
  GlassCard,
  Button,
  Badge,
  CodeBadge,
  IconButton,
  WorkflowActions,
  WORKFLOW_STATES,
  RegenerateButton,
  QuickFeedback,
  FeedbackBanner,
  TextToSpeechButton,
} from '../shared';
import { useApp } from '../../context/AppContext';
import { ClinicalDecisionSupport } from './ClinicalDecisionSupport';

// Accordion Section Component
function AccordionSection({ title, icon: Icon, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <GlassCard className="overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-500/20 rounded-xl">
            <Icon className="w-5 h-5 text-primary-700" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-slate-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-600" />
        )}
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </GlassCard>
  );
}

// Accept/Reject Toggle
function AcceptRejectToggle({ accepted, onAccept, onReject }) {
  return (
    <div className="flex items-center gap-1">
      <IconButton
        icon={Check}
        variant={accepted === true ? 'success' : 'ghost'}
        size="sm"
        onClick={onAccept}
        title="Accept"
      />
      <IconButton
        icon={X}
        variant={accepted === false ? 'danger' : 'ghost'}
        size="sm"
        onClick={onReject}
        title="Reject"
      />
    </div>
  );
}

// Clinical Summary Section
function ClinicalSummary({ summary }) {
  return (
    <AccordionSection title="Clinical Assessment Summary" icon={FileText}>
      <div className="p-4 bg-white/50 rounded-xl">
        <p className="text-slate-700 leading-relaxed">{summary}</p>
      </div>
    </AccordionSection>
  );
}

// Interventions Section
function InterventionsSection({ interventions, onUpdate }) {
  return (
    <AccordionSection title="Interventions & Procedures" icon={Stethoscope}>
      <div className="space-y-3">
        {interventions.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-xl transition-all duration-200 ${
              item.accepted === false
                ? 'bg-red-50/50 border border-red-200/50'
                : 'bg-white/30 hover:bg-white/40'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-slate-800">{item.name}</span>
                  <CodeBadge code={item.code} />
                </div>
                <p className="text-sm text-slate-600 mb-2">{item.rationale}</p>
                <Badge variant="info" size="sm">
                  {item.urgency}
                </Badge>
              </div>
              <AcceptRejectToggle
                accepted={item.accepted}
                onAccept={() => onUpdate('interventions', item.id, true)}
                onReject={() => onUpdate('interventions', item.id, false)}
              />
            </div>
          </div>
        ))}
      </div>
    </AccordionSection>
  );
}

// Medications Section
function MedicationsSection({ medications, onUpdate }) {
  return (
    <AccordionSection title="Pharmacological Management" icon={Pill}>
      <div className="space-y-4">
        {/* STOP Medications */}
        {medications.stop.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-red-500/20 rounded-lg">
                <Minus className="w-4 h-4 text-red-600" />
              </div>
              <span className="font-semibold text-red-700">STOP</span>
            </div>
            <div className="space-y-2">
              {medications.stop.map((med) => (
                <div
                  key={med.id}
                  className={`p-4 rounded-xl border-l-4 border-red-500 ${
                    med.accepted === false ? 'bg-gray-100/50' : 'bg-red-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">{med.name}</span>
                        <Badge variant="danger" size="sm">{med.dose}</Badge>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{med.reason}</p>
                    </div>
                    <AcceptRejectToggle
                      accepted={med.accepted}
                      onAccept={() => onUpdate('stop', med.id, true)}
                      onReject={() => onUpdate('stop', med.id, false)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* START Medications */}
        {medications.start.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-green-500/20 rounded-lg">
                <Plus className="w-4 h-4 text-green-600" />
              </div>
              <span className="font-semibold text-green-700">START</span>
            </div>
            <div className="space-y-2">
              {medications.start.map((med) => (
                <div
                  key={med.id}
                  className={`p-4 rounded-xl border-l-4 border-green-500 ${
                    med.accepted === false ? 'bg-gray-100/50' : 'bg-green-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">{med.name}</span>
                        <Badge variant="success" size="sm">{med.dose}</Badge>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{med.reason}</p>
                      {med.instructions && (
                        <p className="text-xs text-amber-700 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {med.instructions}
                        </p>
                      )}
                    </div>
                    <AcceptRejectToggle
                      accepted={med.accepted}
                      onAccept={() => onUpdate('start', med.id, true)}
                      onReject={() => onUpdate('start', med.id, false)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONTINUE Medications */}
        {medications.continue.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-blue-500/20 rounded-lg">
                <ArrowRight className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-semibold text-blue-700">CONTINUE</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {medications.continue.map((med) => (
                <div
                  key={med.id}
                  className="p-3 bg-blue-50/50 rounded-xl border-l-4 border-blue-400"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-slate-800">{med.name}</span>
                      <span className="text-sm text-slate-600 ml-2">{med.dose}</span>
                    </div>
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AccordionSection>
  );
}

// Monitoring Section
function MonitoringSection({ monitoring, onUpdate }) {
  return (
    <AccordionSection title="Monitoring & Nursing Care" icon={Activity}>
      <div className="space-y-2">
        {monitoring.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between p-3 rounded-xl transition-all ${
              item.accepted === false
                ? 'bg-red-50/50 border border-red-200/50'
                : 'bg-white/30 hover:bg-white/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  item.accepted ? 'bg-green-500 border-green-500' : 'border-slate-400'
                }`}
              >
                {item.accepted && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="text-slate-700">{item.task}</span>
            </div>
            <AcceptRejectToggle
              accepted={item.accepted}
              onAccept={() => onUpdate('monitoring', item.id, true)}
              onReject={() => onUpdate('monitoring', item.id, false)}
            />
          </div>
        ))}
      </div>
    </AccordionSection>
  );
}

// Investigations Section
function InvestigationsSection({ investigations, onUpdate }) {
  return (
    <AccordionSection title="Laboratory Investigations" icon={FlaskConical}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {investigations.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-xl transition-all ${
              item.accepted === false
                ? 'bg-red-50/50 border border-red-200/50'
                : 'bg-white/30 hover:bg-white/40'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-semibold text-slate-800">{item.name}</span>
                <div className="flex items-center gap-2 mt-1">
                  <CodeBadge code={item.code} />
                  <Badge
                    variant={item.priority === 'Urgent' ? 'danger' : 'info'}
                    size="sm"
                  >
                    {item.priority}
                  </Badge>
                </div>
              </div>
              <AcceptRejectToggle
                accepted={item.accepted}
                onAccept={() => onUpdate('investigations', item.id, true)}
                onReject={() => onUpdate('investigations', item.id, false)}
              />
            </div>
          </div>
        ))}
      </div>
    </AccordionSection>
  );
}

// Disposition Section
function DispositionSection({ disposition }) {
  return (
    <AccordionSection title="Disposition & Follow-up" icon={Calendar}>
      <div className="space-y-4">
        {/* Follow-up */}
        <div className="p-4 bg-primary-100/70 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-primary-700" />
            <span className="font-semibold text-slate-800">Follow-up Appointment</span>
          </div>
          <p className="text-lg font-bold text-slate-800">TCA: {disposition.followUp}</p>
        </div>

        {/* Referrals */}
        <div>
          <h4 className="font-medium text-slate-800 mb-2">Referrals</h4>
          <div className="space-y-2">
            {disposition.referrals.map((ref, idx) => (
              <div key={idx} className="p-3 bg-white/30 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{ref.specialty}</span>
                  <Badge variant="info" size="sm">{ref.urgency}</Badge>
                </div>
                <p className="text-sm text-slate-600 mt-1">{ref.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Patient Education */}
        <div>
          <h4 className="font-medium text-slate-800 mb-2">Patient Education</h4>
          <ul className="space-y-2">
            {disposition.patientEducation.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 p-2 bg-white/40 rounded-lg"
              >
                <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-slate-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AccordionSection>
  );
}

// CPG References Section
function CPGReferencesSection({ references }) {
  return (
    <AccordionSection title="CPG References" icon={BookOpen} defaultOpen={false}>
      <div className="flex flex-wrap gap-2">
        {references.map((ref, idx) => (
          <button
            key={idx}
            className="px-3 py-2 bg-primary-100/70 hover:bg-primary-200/70 rounded-xl text-sm text-slate-700 transition-colors text-left"
          >
            <span className="font-medium text-slate-800">{ref.title}</span>
            <span className="text-slate-600 ml-1">
              ({ref.edition}, Pg {ref.page})
            </span>
          </button>
        ))}
      </div>
    </AccordionSection>
  );
}

// Main Care Plan Section
export function CarePlanSection() {
  const { state, updateCarePlanItem, updateMedication, finalizePlan, goToStep } = useApp();
  const { carePlan, patientData, selectedDiagnosis } = state;
  
  // Local state for workflow and notes
  const [workflowStatus, setWorkflowStatus] = useState(WORKFLOW_STATES.DRAFT);
  const [workflowHistory, setWorkflowHistory] = useState([]);
  const [notes, setNotes] = useState([]);

  if (!carePlan) return null;

  const handleBack = () => {
    goToStep(2);
  };

  const handleStatusChange = (newStatus, comment) => {
    setWorkflowStatus(newStatus);
    setWorkflowHistory(prev => [
      {
        status: newStatus,
        action: newStatus === WORKFLOW_STATES.REVIEWED ? 'Marked as Reviewed' : 'Approved',
        user: 'Dr. Current User',
        timestamp: new Date().toLocaleString(),
        comment
      },
      ...prev
    ]);
  };

  const handleReject = (comment) => {
    setWorkflowStatus(WORKFLOW_STATES.DRAFT);
    setWorkflowHistory(prev => [
      {
        status: WORKFLOW_STATES.DRAFT,
        action: 'Sent back for revision',
        user: 'Dr. Current User',
        timestamp: new Date().toLocaleString(),
        comment
      },
      ...prev
    ]);
  };

  const handleRegenerate = async (feedback) => {
    // Mock regeneration - in production this would call the AI backend
    console.log('Regenerating with feedback:', feedback);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    // In production, this would update the carePlan with new recommendations
  };

  const handleFeedback = (itemId, feedbackType) => {
    console.log('Feedback for item:', itemId, feedbackType);
    // In production, this would send feedback to the RAG system
  };

  // Generate summary text for TTS
  const generateCarePlanSummary = () => {
    let summary = `Care Plan for ${patientData?.patientName || 'Patient'}. `;
    summary += `Primary Diagnosis: ${selectedDiagnosis?.name || 'Not specified'}. `;
    summary += `Clinical Summary: ${carePlan.clinicalSummary}. `;
    
    if (carePlan.medications.start.length > 0) {
      summary += `New Medications to Start: ${carePlan.medications.start.map(m => m.name).join(', ')}. `;
    }
    if (carePlan.medications.stop.length > 0) {
      summary += `Medications to Stop: ${carePlan.medications.stop.map(m => m.name).join(', ')}. `;
    }
    
    summary += `Follow-up: ${carePlan.disposition.followUp}.`;
    return summary;
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-primary-900 mb-2">
          AI-Generated Care Plan
        </h2>
        <p className="text-primary-500">
          Review and customize the evidence-based care recommendations
        </p>
      </div>

      {/* Feedback Banner */}
      <FeedbackBanner />

      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white/40 rounded-xl border border-slate-200">
        <div className="flex items-center gap-3">
          <RegenerateButton
            onRegenerate={handleRegenerate}
            label="Regenerate Care Plan"
          />
          <TextToSpeechButton
            text={generateCarePlanSummary()}
            label="Read Summary"
          />
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary-600" />
          <span className="text-sm text-slate-600">Evidence-based recommendations</span>
        </div>
      </div>

      {/* Clinical Decision Support */}
      <ClinicalDecisionSupport />

      <ClinicalSummary summary={carePlan.clinicalSummary} />
      <InterventionsSection
        interventions={carePlan.interventions}
        onUpdate={updateCarePlanItem}
      />
      <MedicationsSection
        medications={carePlan.medications}
        onUpdate={updateMedication}
      />
      <MonitoringSection
        monitoring={carePlan.monitoring}
        onUpdate={updateCarePlanItem}
      />
      <InvestigationsSection
        investigations={carePlan.investigations}
        onUpdate={updateCarePlanItem}
      />
      <DispositionSection disposition={carePlan.disposition} />
      <CPGReferencesSection references={carePlan.cpgReferences} />

      {/* Approval Workflow */}
      <div className="mt-6">
        <WorkflowActions
          currentStatus={workflowStatus}
          onStatusChange={handleStatusChange}
          onReject={handleReject}
          history={workflowHistory}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
        <Button
          variant="secondary"
          size="lg"
          onClick={handleBack}
        >
          Back to Diagnosis
        </Button>
        <Button
          variant="primary"
          size="lg"
          icon={Check}
          onClick={finalizePlan}
          disabled={workflowStatus !== WORKFLOW_STATES.APPROVED}
          glow={workflowStatus === WORKFLOW_STATES.APPROVED}
          className="min-w-[250px]"
        >
          {workflowStatus === WORKFLOW_STATES.APPROVED 
            ? 'Finalize & Save Care Plan' 
            : 'Approval Required to Finalize'}
        </Button>
      </div>
      
      {workflowStatus !== WORKFLOW_STATES.APPROVED && (
        <p className="text-center text-sm text-slate-500">
          Complete the approval workflow above to enable finalization
        </p>
      )}
    </div>
  );
}
