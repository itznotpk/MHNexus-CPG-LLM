import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ToastProvider } from './components/shared/Notification';
import Sidebar from './components/layout/Sidebar';
import {
  DataInputSection,
  DiagnosisSection,
  CarePlanSection,
  OutputSection,
} from './components/sections';
import { StepIndicator, GlassPanel } from './components/shared';
import Home from './components/pages/Home';
import MyPatients from './components/pages/MyPatients';
import Settings from './components/pages/Settings';

const steps = [
  { id: 1, label: 'Data Input' },
  { id: 2, label: 'Diagnosis' },
  { id: 3, label: 'Care Plan' },
  { id: 4, label: 'Complete' },
];

function AppContent() {
  const { state, dispatch } = useApp();
  const { isDark } = useTheme();
  const { currentStep } = state;
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, patients, consultation, settings
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const handleStartConsult = (patient, triage) => {
    // Pre-fill patient data and navigate to consultation
    dispatch({ 
      type: 'SET_PATIENT', 
      payload: {
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        nsn: patient.nsn,
        dob: '' // Can be calculated from age if needed
      }
    });
    
    // Set vitals from triage if available
    if (triage?.vitals) {
      const [systolic, diastolic] = triage.vitals.bp.split('/');
      dispatch({
        type: 'SET_VITALS',
        payload: {
          bloodPressureSystolic: systolic,
          bloodPressureDiastolic: diastolic,
          heartRate: triage.vitals.hr?.toString() || '',
          temperature: triage.vitals.temp?.toString() || '',
          oxygenSaturation: triage.vitals.spo2?.toString() || '',
          respiratoryRate: '',
          weight: '',
          height: '',
          bmi: ''
        }
      });
    }
    
    // Set clinical notes from chief complaint
    if (triage?.chiefComplaint) {
      dispatch({
        type: 'SET_CLINICAL_NOTES',
        payload: `Chief Complaint: ${triage.chiefComplaint}\n\n${triage.notes || ''}`
      });
    }
    
    // Reset to step 1 and navigate to consultation
    dispatch({ type: 'RESET' });
    setCurrentView('consultation');
  };

  const handleNewPatient = () => {
    dispatch({ type: 'RESET' });
    setCurrentView('consultation');
  };

  const handleViewChart = (patient) => {
    // For now, navigate to consultation with patient data
    // In a full implementation, this would show a read-only chart view
    console.log('Viewing chart for:', patient);
  };

  const renderCurrentSection = () => {
    switch (currentStep) {
      case 1:
        return <DataInputSection />;
      case 2:
        return <DiagnosisSection />;
      case 3:
        return <CarePlanSection />;
      case 4:
        return <OutputSection />;
      default:
        return <DataInputSection />;
    }
  };

  const renderMainContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Home onStartConsult={handleStartConsult} />;
      case 'patients':
        return <MyPatients onViewChart={handleViewChart} onNewPatient={handleNewPatient} />;
      case 'consultation':
        return (
          <>
            {/* Step Indicator */}
            <div className="mb-8">
              <StepIndicator steps={steps} currentStep={currentStep} />
            </div>

            {/* Main Content Area */}
            <GlassPanel className="min-h-[600px]">
              {renderCurrentSection()}
            </GlassPanel>
          </>
        );
      case 'settings':
        return <Settings />;
      default:
        return <Home onStartConsult={handleStartConsult} />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-slate-100 via-white to-slate-100'
    }`}>
      {/* Sidebar */}
      <Sidebar 
        currentView={currentView}
        onNavigate={handleNavigate}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <main 
        className={`min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <div className="p-6 lg:p-8">
          {renderMainContent()}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
