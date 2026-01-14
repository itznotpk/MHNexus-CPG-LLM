import React from 'react';
import { FileText, CheckCircle2, Edit3, Loader2, Calendar, Zap } from 'lucide-react';
import { GlassCard, TextArea, Button, VoiceInputButton, VoiceStatusIndicator } from '../shared';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { saveConsultation } from '../../lib/supabase';

export function ClinicalNotes({ isConfirmed, onConfirm }) {
  const { state, dispatch } = useApp();
  const { isDark } = useTheme();
  const { clinicalNotes, patient } = state;
  const [isListening, setIsListening] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState('');
  const [nextReviewDate, setNextReviewDate] = React.useState('');

  const handleChange = (value) => {
    dispatch({ type: 'SET_CLINICAL_NOTES', payload: value });
    // If notes change after confirmation, reset confirmation
    if (isConfirmed && onConfirm) {
      onConfirm(false);
    }
  };

  const handleVoiceTranscript = (transcript) => {
    // Append the transcript to existing notes
    const newValue = clinicalNotes
      ? clinicalNotes + ' ' + transcript
      : transcript;
    handleChange(newValue);
  };

  const handleConfirm = async () => {
    // Get patient NRIC
    const patientNric = patient?.nsn;
    if (!patientNric) {
      setSaveError('No patient selected. Please search for a patient first.');
      return;
    }

    setIsSaving(true);
    setSaveError('');

    try {
      const result = await saveConsultation(patientNric, clinicalNotes, nextReviewDate || null);
      if (result.success) {
        console.log('✅ Clinical notes saved to Supabase');
        if (onConfirm) onConfirm(true);
      } else {
        // Show detailed error message
        const errorMsg = result.error?.message || result.error?.details || 'Unknown error';
        const errorCode = result.error?.code || '';
        
        // Check for authentication/RLS error
        if (result.error?.isAuthError || errorCode === '42501') {
          setSaveError('Failed to save: Authentication required. Only authenticated users may insert or update consultations.');
        } else if (errorCode === '23503') {
          setSaveError('Patient must be registered before saving clinical notes.');
        } else if (errorCode === '42P01') {
          setSaveError('Consultations table not found. Please run the SQL schema.');
        } else {
          setSaveError(`Failed to save: ${errorMsg}`);
        }
        console.error('Save error:', result.error);
      }
    } catch (err) {
      setSaveError(`Error: ${err.message || 'An error occurred while saving.'}`);
      console.error('Exception:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = () => {
    if (onConfirm) onConfirm(false);
  };

  const handleDemoFill = () => {
    const demoNotes = `Chest pain and tends to vomit`;
    handleChange(demoNotes);
  };

  return (
    <GlassCard className={`p-5 ${isConfirmed ? 'border-2 border-green-500/30' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${isConfirmed ? 'bg-green-500/20' : 'bg-[var(--accent-primary)]/20'}`}>
            {isConfirmed
              ? <CheckCircle2 className="w-5 h-5 text-green-500" />
              : <FileText className="w-5 h-5 text-[var(--accent-primary)]" />
            }
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>Clinical Notes</h3>
            {isConfirmed && (
              <p className="text-xs text-green-500">Notes confirmed ✓</p>
            )}
          </div>
          <VoiceStatusIndicator isListening={isListening} />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDemoFill}
            disabled={isConfirmed}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${isConfirmed
                ? 'opacity-50 cursor-not-allowed'
                : isDark
                  ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              }`}
            title="Fill with demo data"
          >
            <Zap className="w-4 h-4" />
            Demo Fill
          </button>
          <VoiceInputButton
            onTranscript={handleVoiceTranscript}
          />
        </div>
      </div>

      <TextArea
        id="clinical-notes"
        label="History & Physical Examination"
        rows={6}
        placeholder="Enter clinical history, presenting complaints, physical examination findings... or use voice input"
        value={clinicalNotes}
        onChange={(e) => handleChange(e.target.value)}
        helper="Include relevant symptoms, duration, and examination findings. Voice dictation supported."
        disabled={isConfirmed || isSaving}
      />

      {/* Next Review Date Picker */}
      <div className="mt-4">
        <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <Calendar className="w-4 h-4 text-[var(--accent-primary)]" />
          Next Review Date (TCA)
        </label>
        <input
          type="date"
          value={nextReviewDate}
          onChange={(e) => setNextReviewDate(e.target.value)}
          disabled={isConfirmed || isSaving}
          min={new Date().toISOString().split('T')[0]}
          className={`w-full sm:w-64 px-4 py-2.5 rounded-xl border transition-all
            focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/50
            ${isDark 
              ? 'bg-white/5 border-white/10 text-white' 
              : 'bg-white border-slate-200 text-slate-800'}
            ${isConfirmed || isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Set the patient's next follow-up appointment date
        </p>
      </div>

      {/* Save Error Message */}
      {saveError && (
        <div className="mt-2 p-2 rounded-lg bg-red-500/20 border border-red-500/30">
          <p className="text-sm text-red-500">{saveError}</p>
        </div>
      )}

      {/* Confirm/Edit Button */}
      <div className="mt-4 flex justify-end">
        {isConfirmed ? (
          <Button
            variant="secondary"
            size="sm"
            icon={Edit3}
            onClick={handleEdit}
          >
            Edit Notes
          </Button>
        ) : (
          <Button
            variant="success"
            size="md"
            icon={isSaving ? Loader2 : CheckCircle2}
            onClick={handleConfirm}
            disabled={!clinicalNotes?.trim() || isSaving}
            loading={isSaving}
          >
            {isSaving ? 'Saving...' : 'Confirm Clinical Notes'}
          </Button>
        )}
      </div>
    </GlassCard>
  );
}
