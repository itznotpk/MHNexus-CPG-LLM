import React, { createContext, useContext, useState, useReducer } from 'react';
import {
  samplePatientData,
  sampleClinicalNotes,
  sampleVitals,
  sampleMPISData,
  sampleDiagnosis,
  sampleCarePlan,
  mpisPatientDatabase,
} from '../data/sampleData';
import { searchPatientByNRIC, isSupabaseConfigured } from '../lib/supabase';

// Toggle this to switch between Supabase and mock data
// Set to true once you've deployed the schema to Supabase
const USE_SUPABASE = isSupabaseConfigured();

const AppContext = createContext();

const initialState = {
  currentStep: 1, // 1: Input, 2: Diagnosis, 3: CarePlan, 4: Output
  patient: {
    name: '',
    dob: '',
    nsn: '',
    gender: '',
    age: null,
  },
  clinicalNotes: '',
  vitals: {
    bpSystolic: '',
    bpDiastolic: '',
    hr: '',
    temp: '',
    rr: '',
    spo2: '',
    weight: '',
    height: '',
  },
  mpisData: {
    race: '',
    ethnicity: '',
    allergies: '',
    comorbidities: [],
    currentMeds: [],
  },
  mpisSynced: false,
  diagnosis: null,
  carePlan: null,
  isAnalyzing: false,
  isGeneratingPlan: false,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_PATIENT':
      return { ...state, patient: { ...state.patient, ...action.payload } };
    case 'SET_CLINICAL_NOTES':
      return { ...state, clinicalNotes: action.payload };
    case 'SET_VITALS':
      return { ...state, vitals: { ...state.vitals, ...action.payload } };
    case 'SET_MPIS_DATA':
      return { ...state, mpisData: action.payload, mpisSynced: true };
    case 'SET_DIAGNOSIS':
      return { ...state, diagnosis: action.payload };
    case 'SELECT_DIAGNOSIS':
      return {
        ...state,
        diagnosis: {
          ...state.diagnosis,
          selectedDiagnosisId: action.payload
        }
      };
    case 'SET_CARE_PLAN':
      return { ...state, carePlan: action.payload };
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_ANALYZING':
      return { ...state, isAnalyzing: action.payload };
    case 'SET_GENERATING_PLAN':
      return { ...state, isGeneratingPlan: action.payload };
    case 'UPDATE_CARE_PLAN_ITEM':
      return {
        ...state,
        carePlan: {
          ...state.carePlan,
          [action.payload.section]: updateItemAcceptance(
            state.carePlan[action.payload.section],
            action.payload.id,
            action.payload.accepted
          ),
        },
      };
    case 'UPDATE_MEDICATION':
      return {
        ...state,
        carePlan: {
          ...state.carePlan,
          medications: {
            ...state.carePlan.medications,
            [action.payload.type]: state.carePlan.medications[action.payload.type].map((med) =>
              med.id === action.payload.id ? { ...med, accepted: action.payload.accepted } : med
            ),
          },
        },
      };
    case 'LOAD_DEMO_DATA':
      return {
        ...state,
        patient: samplePatientData,
        clinicalNotes: sampleClinicalNotes.history,
        vitals: sampleVitals,
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

function updateItemAcceptance(items, id, accepted) {
  if (Array.isArray(items)) {
    return items.map((item) => (item.id === id ? { ...item, accepted } : item));
  }
  return items;
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const loadDemoData = () => {
    dispatch({ type: 'LOAD_DEMO_DATA' });
  };

  const syncMPIS = async (nsn) => {
    // Try Supabase first if configured
    if (USE_SUPABASE) {
      console.log('🔍 Searching Supabase for NRIC:', nsn);
      const result = await searchPatientByNRIC(nsn);

      if (result.error) {
        console.warn('Supabase error, falling back to mock data:', result.error);
        // Fall through to mock data
      } else if (result.found) {
        console.log('✅ Patient found in Supabase:', result.patient.name);
        const patient = result.patient;
        dispatch({ type: 'SET_PATIENT', payload: patient });
        dispatch({
          type: 'SET_MPIS_DATA', payload: {
            race: patient.race,
            ethnicity: patient.ethnicity,
            allergies: patient.allergies,
            comorbidities: patient.comorbidities,
            currentMeds: patient.currentMeds,
          }
        });
        return { found: true, patient: patient, mpisData: patient };
      } else {
        console.log('❌ Patient not found in Supabase');
        dispatch({ type: 'SET_PATIENT', payload: { nsn: nsn } });
        return { found: false, nsn: nsn };
      }
    }

    // Fallback to mock data
    console.log('📦 Using mock data for NRIC:', nsn);
    return new Promise((resolve) => {
      setTimeout(() => {
        // Lookup patient by NRIC in the mock database
        const patientRecord = mpisPatientDatabase[nsn];

        if (patientRecord) {
          // Patient found - auto-populate both patient and MPIS data
          dispatch({ type: 'SET_PATIENT', payload: patientRecord.patient });
          dispatch({ type: 'SET_MPIS_DATA', payload: patientRecord.mpisData });
          resolve({ found: true, patient: patientRecord.patient, mpisData: patientRecord.mpisData });
        } else {
          // Patient not found - just set the NRIC in patient data
          dispatch({ type: 'SET_PATIENT', payload: { nsn: nsn } });
          resolve({ found: false, nsn: nsn });
        }
      }, 1500);
    });
  };

  const analyzeAssessment = () => {
    dispatch({ type: 'SET_ANALYZING', payload: true });
    return new Promise((resolve) => {
      setTimeout(() => {
        dispatch({ type: 'SET_DIAGNOSIS', payload: sampleDiagnosis });
        dispatch({ type: 'SET_ANALYZING', payload: false });
        dispatch({ type: 'SET_STEP', payload: 2 });
        resolve(sampleDiagnosis);
      }, 2000);
    });
  };

  const confirmDiagnosis = () => {
    dispatch({ type: 'SET_GENERATING_PLAN', payload: true });
    return new Promise((resolve) => {
      setTimeout(() => {
        dispatch({ type: 'SET_CARE_PLAN', payload: sampleCarePlan });
        dispatch({ type: 'SET_GENERATING_PLAN', payload: false });
        dispatch({ type: 'SET_STEP', payload: 3 });
        resolve(sampleCarePlan);
      }, 2000);
    });
  };

  const finalizePlan = () => {
    dispatch({ type: 'SET_STEP', payload: 4 });
  };

  const goToStep = (step) => {
    dispatch({ type: 'SET_STEP', payload: step });
  };

  const updateCarePlanItem = (section, id, accepted) => {
    dispatch({ type: 'UPDATE_CARE_PLAN_ITEM', payload: { section, id, accepted } });
  };

  const updateMedication = (type, id, accepted) => {
    dispatch({ type: 'UPDATE_MEDICATION', payload: { type, id, accepted } });
  };

  const selectDiagnosis = (diagnosisId) => {
    dispatch({ type: 'SELECT_DIAGNOSIS', payload: diagnosisId });
  };

  const resetApp = () => {
    dispatch({ type: 'RESET' });
  };

  const calculateBMI = () => {
    const { weight, height } = state.vitals;
    if (weight && height) {
      const heightM = height / 100;
      return (weight / (heightM * heightM)).toFixed(1);
    }
    return null;
  };

  const value = {
    state,
    dispatch,
    loadDemoData,
    syncMPIS,
    analyzeAssessment,
    confirmDiagnosis,
    finalizePlan,
    goToStep,
    updateCarePlanItem,
    updateMedication,
    selectDiagnosis,
    resetApp,
    calculateBMI,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
