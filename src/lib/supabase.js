/**
 * Supabase Client Configuration
 * ==============================
 * 
 * This file initializes the Supabase client for the MHNexus CPG-LLM application.
 * 
 * Setup Instructions:
 * 1. Create a project at https://app.supabase.com
 * 2. Go to Project Settings → API
 * 3. Copy your Project URL and anon/public key
 * 4. Create a .env file in the project root with:
 *    VITE_SUPABASE_URL=your_project_url
 *    VITE_SUPABASE_ANON_KEY=your_anon_key
 * 5. Restart the Vite dev server
 */

import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '⚠️ Supabase configuration missing!\n\n' +
    'Please create a .env file in the project root with:\n' +
    '  VITE_SUPABASE_URL=your_project_url\n' +
    '  VITE_SUPABASE_ANON_KEY=your_anon_key\n\n' +
    'Get these values from: Supabase Dashboard → Project Settings → API'
  );
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    // Persist session to localStorage
    persistSession: true,
    // Automatically refresh tokens before expiry
    autoRefreshToken: true,
    // Detect session from URL (for OAuth callbacks)
    detectSessionInUrl: true,
    // Storage key for session
    storageKey: 'mhnexus-auth',
  },
  db: {
    // Use public schema
    schema: 'public',
  },
  global: {
    // Custom headers for all requests
    headers: {
      'x-application-name': 'MHNexus-CPG-LLM',
    },
  },
});

/**
 * Check if Supabase is properly configured
 * @returns {boolean} True if configuration is valid
 */
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

/**
 * Get current authenticated user
 * @returns {Promise<User|null>} Current user or null
 */
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

/**
 * Get current session
 * @returns {Promise<Session|null>} Current session or null
 */
export const getCurrentSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

/**
 * Sign out the current user
 * @returns {Promise<void>}
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

/**
 * Subscribe to auth state changes
 * @param {Function} callback - Callback function (event, session)
 * @returns {Function} Unsubscribe function
 */
export const onAuthStateChange = (callback) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
  return () => subscription.unsubscribe();
};

// ==============================================================================
// PATIENT FUNCTIONS (MPIS Integration)
// ==============================================================================

/**
 * Search for a patient by NRIC
 * @param {string} nric - Patient's NRIC (e.g., "580315-08-1234")
 * @returns {Promise<{found: boolean, patient: Object|null, error: Error|null}>}
 */
export const searchPatientByNRIC = async (nric) => {
  try {
    // Call the NEW database function v2
    const { data, error } = await supabase
      .rpc('search_patient_v2', { p_nric: nric });

    if (error) {
      console.error('Error searching patient:', error);
      return { found: false, patient: null, error };
    }

    if (data && data.length > 0) {
      const patient = data[0];
      return {
        found: true,
        patient: {
          id: patient.nric, // Using NRIC as the primary identifier
          nsn: patient.nric,
          name: patient.full_name,
          dob: patient.date_of_birth,
          age: patient.age,
          gender: patient.gender === 'male' ? 'Male' : patient.gender === 'female' ? 'Female' : 'Other',
          race: patient.race,
          allergies: patient.allergies,
          comorbidities: patient.comorbidities || [],
          currentMeds: patient.current_medications || [],
          riskLevel: patient.risk_level,
          mpisSyncedAt: patient.mpis_synced_at,
          vitalsHistory: patient.vitals_history || [],
        },
        error: null
      };
    }

    return { found: false, patient: null, error: null };
  } catch (err) {
    console.error('Exception searching patient:', err);
    return { found: false, patient: null, error: err };
  }
};

/**
 * Register a new patient
 * @param {Object} patientData - Patient data
 * @returns {Promise<{success: boolean, patientId: string|null, error: Error|null}>}
 * Note: patientId is now the NRIC (primary key) instead of UUID
 */
export const registerPatient = async (patientData) => {
  try {
    const { data, error } = await supabase
      .rpc('register_patient', {
        p_nric: patientData.nric,
        p_full_name: patientData.fullName,
        p_date_of_birth: patientData.dateOfBirth,
        p_gender: patientData.gender.toLowerCase(),
        p_race: patientData.race || null,
        p_allergies: patientData.allergies || null,
        p_comorbidities: patientData.comorbidities || null,
        p_created_by: patientData.createdBy || null,
      });

    if (error) {
      console.error('Error registering patient:', error);
      return { success: false, patientId: null, error };
    }

    return { success: true, patientId: data, error: null };
  } catch (err) {
    console.error('Exception registering patient:', err);
    return { success: false, patientId: null, error: err };
  }
};

/**
 * Update patient data from MPIS sync
 * @param {string} nric - Patient's NRIC
 * @param {Object} mpisData - Data from MPIS
 * @returns {Promise<{success: boolean, error: Error|null}>}
 */
export const updatePatientFromMPIS = async (nric, mpisData) => {
  try {
    const { data, error } = await supabase
      .rpc('update_patient_from_mpis', {
        p_nric: nric,
        p_allergies: mpisData.allergies || null,
        p_comorbidities: mpisData.comorbidities || null,
        p_current_medications: mpisData.currentMeds ? JSON.stringify(mpisData.currentMeds) : null,
        p_mpis_data: mpisData.rawData ? JSON.stringify(mpisData.rawData) : null,
      });

    if (error) {
      console.error('Error updating patient from MPIS:', error);
      return { success: false, error };
    }

    return { success: data, error: null };
  } catch (err) {
    console.error('Exception updating patient from MPIS:', err);
    return { success: false, error: err };
  }
};

/**
 * Save new vital signs reading for a patient
 * @param {string} nric - Patient's NRIC
 * @param {Object} vitals - Vital signs data
 * @returns {Promise<{success: boolean, history: Array|null, error: Error|null}>}
 */
export const savePatientVitals = async (nric, vitals) => {
  try {
    const { data, error } = await supabase
      .rpc('push_patient_vitals', {
        p_nric: nric,
        p_vitals: [vitals] // Pass array directly, Supabase will handle JSONB conversion
      });

    if (error) {
      console.error('Error saving patient vitals:', error);
      return { success: false, history: null, error };
    }

    return { success: true, history: data, error: null };
  } catch (err) {
    console.error('Exception saving patient vitals:', err);
    return { success: false, history: null, error: err };
  }
};

/**
 * Get all patients (for My Patients page)
 * @param {Object} options - Query options
 * @returns {Promise<{patients: Array, error: Error|null}>}
 */
export const getAllPatients = async (options = {}) => {
  try {
    let query = supabase
      .from('patients')
      .select('*')
      .order('updated_at', { ascending: false });

    // Apply status filter
    if (options.status && options.status !== 'all') {
      query = query.eq('status', options.status);
    }

    // Apply search filter (search both with and without dashes for NRIC)
    if (options.search) {
      const normalizedSearch = options.search.replace(/-/g, ''); // Remove dashes
      query = query.or(`full_name.ilike.%${options.search}%,nric.ilike.%${options.search}%,nric.ilike.%${normalizedSearch}%`);
    }

    // Apply limit
    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching patients:', error);
      return { patients: [], error };
    }

    console.log('Supabase returned patients:', data); // Debug log

    // Transform to UI format
    const patients = data.map(p => ({
      id: p.nric, // Using NRIC as the primary identifier
      nsn: p.nric,
      name: p.full_name,
      dob: p.date_of_birth,
      age: p.date_of_birth ? Math.floor((new Date() - new Date(p.date_of_birth)) / (365.25 * 24 * 60 * 60 * 1000)) : null,
      gender: p.gender === 'male' ? 'Male' : p.gender === 'female' ? 'Female' : 'Other',
      race: p.race,
      allergies: p.allergies,
      comorbidities: p.comorbidities || [],
      currentMeds: p.current_medications || [],
      riskLevel: p.risk_level || 'low',
      status: p.status || 'active',
      mpisSyncedAt: p.mpis_synced_at,
      updatedAt: p.updated_at,
      // UI-required fields with defaults
      diagnoses: p.comorbidities || [], // Use comorbidities as diagnoses
      lastVisit: p.updated_at ? new Date(p.updated_at).toISOString().split('T')[0] : null,
      nextReview: null, // Not in DB yet
      tcaDays: null, // Not in DB yet
      phone: null, // Removed from schema
      email: null, // Removed from schema
      vitalsHistory: p.vitals_history || [],
    }));

    return { patients, error: null };
  } catch (err) {
    console.error('Exception fetching patients:', err);
    return { patients: [], error: err };
  }
};

// ==============================================================================
// PROFILE FUNCTIONS
// ==============================================================================

/**
 * Get current user's profile
 * @returns {Promise<{profile: Object|null, error: Error|null}>}
 */
export const getCurrentProfile = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { profile: null, error: null };
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return { profile: null, error };
    }

    return { profile: data, error: null };
  } catch (err) {
    console.error('Exception fetching profile:', err);
    return { profile: null, error: err };
  }
};

/**
 * Update current user's profile
 * @param {Object} updates - Fields to update
 * @returns {Promise<{success: boolean, error: Error|null}>}
 */
export const updateProfile = async (updates) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: new Error('Not authenticated') };
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) {
      console.error('Error updating profile:', error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('Exception updating profile:', err);
    return { success: false, error: err };
  }
};

// ==============================================================================
// CONSULTATION FUNCTIONS
// ==============================================================================

/**
 * Save or update a consultation for a patient
 * Uses RPC function with SECURITY DEFINER to bypass RLS (for demo)
 * @param {string} patientNric - Patient's NRIC
 * @param {string} clinicalNotes - Clinical notes text
 * @param {string|null} nextReview - Next review date (YYYY-MM-DD format)
 * @param {Array|null} diagnoses - Array of selected diagnoses objects
 * @returns {Promise<{success: boolean, data: Object|null, error: Error|null}>}
 */
export const saveConsultation = async (patientNric, clinicalNotes, nextReview = null, diagnoses = []) => {
  try {
    // Use RPC function with SECURITY DEFINER to bypass RLS
    const { data, error } = await supabase
      .rpc('save_consultation_bypass', {
        p_patient_nric: patientNric,
        p_clinical_notes: clinicalNotes,
        p_next_review: nextReview,
        p_diagnoses: diagnoses
      });

    if (error) {
      console.error('Error saving consultation:', error);
      return { success: false, data: null, error };
    }

    console.log('✅ Consultation saved:', data);
    return { success: true, data, error: null };
  } catch (err) {
    console.error('Exception saving consultation:', err);
    return { success: false, data: null, error: err };
  }
};

/**
 * Get consultation for a patient by NRIC
 * @param {string} patientNric - Patient's NRIC
 * @returns {Promise<{found: boolean, consultation: Object|null, error: Error|null}>}
 */
export const getPatientConsultation = async (patientNric) => {
  try {
    const { data, error } = await supabase
      .from('consultations')
      .select(`
        *,
        doctor:created_by(full_name)
      `)
      .eq('patient_nric', patientNric)
      .single();

    if (error) {
      // PGRST116 means no rows found - not an error for our purposes
      if (error.code === 'PGRST116') {
        return { found: false, consultation: null, error: null };
      }
      console.error('Error fetching consultation:', error);
      return { found: false, consultation: null, error };
    }

    return {
      found: true,
      consultation: {
        patientNric: data.patient_nric,
        clinicalNotes: data.clinical_notes,
        nextReview: data.next_review,
        diagnoses: data.diagnoses || [],
        consultationTime: data.consultation_time,
        createdBy: data.created_by,
        updatedBy: data.updated_by,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        doctorName: data.doctor?.full_name || 'Unknown'
      },
      error: null
    };
  } catch (err) {
    console.error('Exception fetching consultation:', err);
    return { found: false, consultation: null, error: err };
  }
};

// Export types for TypeScript users (these work as documentation in JS too)
/**
 * @typedef {import('@supabase/supabase-js').User} User
 * @typedef {import('@supabase/supabase-js').Session} Session
 * @typedef {import('@supabase/supabase-js').AuthChangeEvent} AuthChangeEvent
 */

export default supabase;
