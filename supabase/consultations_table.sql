-- ============================================================================
-- CONSULTATIONS TABLE - WITH RPC BYPASS FOR DEMO
-- ============================================================================
-- Run this SQL in your Supabase SQL Editor
-- This adds next_review column and the bypass function for demo purposes
-- Go to: Supabase Dashboard → SQL Editor → New Query → Paste & Run
-- ============================================================================

-- Add next_review column if it doesn't exist
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS next_review DATE;

-- ============================================================================
-- NRIC VALIDATION FUNCTION
-- Accepts: 12 digits (e.g., 580315081234) OR with dashes (e.g., 580315-08-1234)
-- ============================================================================
CREATE OR REPLACE FUNCTION is_valid_nric(nric TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if NRIC matches either:
    -- 1. 12 consecutive digits: 580315081234
    -- 2. Format with dashes: 580315-08-1234 (6 digits - 2 digits - 4 digits)
    RETURN nric ~ '^[0-9]{12}$' OR nric ~ '^[0-9]{6}-[0-9]{2}-[0-9]{4}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Drop existing function
DROP FUNCTION IF EXISTS save_consultation_bypass(TEXT, TEXT);
DROP FUNCTION IF EXISTS save_consultation_bypass(TEXT, TEXT, DATE);

-- Create SECURITY DEFINER function to bypass RLS (for demo purposes)
CREATE OR REPLACE FUNCTION save_consultation_bypass(
    p_patient_nric TEXT,
    p_clinical_notes TEXT,
    p_next_review DATE DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    -- Validate NRIC format
    IF NOT is_valid_nric(p_patient_nric) THEN
        RAISE EXCEPTION 'Invalid NRIC format. Must be 12 digits (e.g., 580315081234) or with dashes (e.g., 580315-08-1234)';
    END IF;

    INSERT INTO consultations (
        patient_nric, 
        clinical_notes, 
        next_review,
        consultation_time,
        created_at,
        updated_at
    )
    VALUES (
        p_patient_nric, 
        p_clinical_notes, 
        p_next_review,
        NOW(),
        NOW(),
        NOW()
    )
    ON CONFLICT (patient_nric) 
    DO UPDATE SET 
        clinical_notes = EXCLUDED.clinical_notes,
        next_review = EXCLUDED.next_review,
        consultation_time = NOW(),
        updated_at = NOW()
    RETURNING json_build_object(
        'patient_nric', patient_nric,
        'clinical_notes', clinical_notes,
        'next_review', next_review,
        'consultation_time', consultation_time
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to everyone (including anon) for demo
GRANT EXECUTE ON FUNCTION save_consultation_bypass(TEXT, TEXT, DATE) TO anon;
GRANT EXECUTE ON FUNCTION save_consultation_bypass(TEXT, TEXT, DATE) TO authenticated;

-- ============================================================================
-- DONE! Consultations table now has:
--   - patient_nric (PK)
--   - clinical_notes
--   - next_review (DATE)
--   - consultation_time
--   - created_by, updated_by, created_at, updated_at
--
-- RPC bypass function enabled for demo (no authentication required)
-- ============================================================================
