import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header, Footer } from './components/layout';
import {
  DataInputSection,
  DiagnosisSection,
  CarePlanSection,
  OutputSection,
  DashboardSection,
} from './components/sections';
import { StepIndicator, GlassPanel, Button } from './components/shared';
import { BarChart3, ClipboardList } from 'lucide-react';

const steps = [
  { id: 1, label: 'Data Input' },
  { id: 2, label: 'Diagnosis' },
  { id: 3, label: 'Care Plan' },
  { id: 4, label: 'Complete' },
];

function AppContent() {
  const { state } = useApp();
  const { currentStep } = state;
  const [activeView, setActiveView] = useState('workflow'); // 'workflow' or 'dashboard'

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* View Toggle Tabs */}
          <div className="flex items-center justify-center mb-6 gap-2">
            <button
              onClick={() => setActiveView('workflow')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
                activeView === 'workflow'
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                  : 'bg-white/60 text-slate-600 hover:bg-white/80'
              }`}
            >
              <ClipboardList className="w-5 h-5" />
              CPG Workflow
            </button>
            <button
              onClick={() => setActiveView('dashboard')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
                activeView === 'dashboard'
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                  : 'bg-white/60 text-slate-600 hover:bg-white/80'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Analytics Dashboard
            </button>
          </div>

          {activeView === 'workflow' ? (
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
          ) : (
            <GlassPanel className="min-h-[600px]">
              <DashboardSection />
            </GlassPanel>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
