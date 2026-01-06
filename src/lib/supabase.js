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

// Export types for TypeScript users (these work as documentation in JS too)
/**
 * @typedef {import('@supabase/supabase-js').User} User
 * @typedef {import('@supabase/supabase-js').Session} Session
 * @typedef {import('@supabase/supabase-js').AuthChangeEvent} AuthChangeEvent
 */

export default supabase;
