import React from 'react';
import { FileText, Sparkles } from 'lucide-react';
import { GlassCard, TextArea, Button, VoiceInputButton, VoiceStatusIndicator } from '../shared';
import { useApp } from '../../context/AppContext';

export function ClinicalNotes() {
  const { state, dispatch, loadDemoData } = useApp();
  const { clinicalNotes } = state;
  const [isListening, setIsListening] = React.useState(false);

  const handleChange = (value) => {
    dispatch({ type: 'SET_CLINICAL_NOTES', payload: value });
  };

  const handleVoiceTranscript = (transcript) => {
    // Append the transcript to existing notes
    const newValue = clinicalNotes 
      ? clinicalNotes + ' ' + transcript 
      : transcript;
    handleChange(newValue);
  };

  return (
    <GlassCard className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-500/20 rounded-xl">
            <FileText className="w-5 h-5 text-primary-700" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">Clinical Notes</h3>
          <VoiceStatusIndicator isListening={isListening} />
        </div>
        <div className="flex items-center gap-2">
          <VoiceInputButton
            onTranscript={handleVoiceTranscript}
          />
          <Button
            variant="secondary"
            size="sm"
            icon={Sparkles}
            onClick={loadDemoData}
          >
            Demo Fill
          </Button>
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
      />
    </GlassCard>
  );
}
