-- ==============================================================================
-- MHNEXUS CPG-LLM DATABASE SCHEMA
-- ==============================================================================
-- Run this SQL in Supabase: Dashboard → SQL Editor → New Query → Paste & Run
-- ==============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. ENUM TYPES
-- ==============================================================================

-- Gender enum
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');

-- Patient status enum
CREATE TYPE patient_status AS ENUM ('active', 'discharged', 'follow-up', 'deceased');

-- Appointment status enum
CREATE TYPE appointment_status AS ENUM ('scheduled', 'waiting', 'in-progress', 'completed', 'cancelled', 'no-show');

-- Priority level enum
CREATE TYPE priority_level AS ENUM ('low', 'normal', 'high', 'urgent', 'emergency');

-- Risk level enum
CREATE TYPE risk_level AS ENUM ('low', 'moderate', 'high', 'critical');

-- Medication action enum
CREATE TYPE medication_action AS ENUM ('start', 'stop', 'continue', 'modify');

-- Vital status enum
CREATE TYPE vital_status AS ENUM ('normal', 'high', 'low', 'critical');

-- Care plan status enum
CREATE TYPE care_plan_status AS ENUM ('draft', 'pending-approval', 'approved', 'active', 'completed', 'cancelled');

-- ==============================================================================
-- 2. USERS / DOCTORS TABLE (extends Supabase auth.users)
-- ==============================================================================

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    title TEXT DEFAULT 'Dr.',
    specialty TEXT,
    license_number TEXT,
    phone TEXT,
    facility TEXT,
    department TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'doctor' CHECK (role IN ('doctor', 'nurse', 'admin', 'pharmacist')),
    
    -- Settings stored as JSONB for flexibility
    settings JSONB DEFAULT '{
        "theme": "dark",
        "accentColor": "cyan",
        "notifications": {
            "email": true,
            "push": true,
            "sms": false,
            "emergencyAlerts": true
        },
        "sessionTimeout": 30
    }'::jsonb,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. PATIENTS TABLE
-- ==============================================================================

CREATE TABLE public.patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Demographics
    nsn TEXT UNIQUE NOT NULL, -- National Health Number (e.g., NSN-2024-78945)
    full_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    age INTEGER GENERATED ALWAYS AS (
        EXTRACT(YEAR FROM age(CURRENT_DATE, date_of_birth))::INTEGER
    ) STORED,
    gender gender_type NOT NULL,
    
    -- Contact Information
    phone TEXT,
    email TEXT,
    address TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    emergency_contact_relationship TEXT,
    
    -- Medical Identifiers
    mrn TEXT, -- Medical Record Number (hospital-specific)
    
    -- Status & Risk
    status patient_status DEFAULT 'active',
    risk_level risk_level DEFAULT 'low',
    
    -- MPIS Data (synced from external system)
    mpis_synced_at TIMESTAMPTZ,
    mpis_data JSONB DEFAULT '{}'::jsonb, -- Stores allergies, comorbidities, etc.
    
    -- Metadata
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast NSN lookups
CREATE INDEX idx_patients_nsn ON public.patients(nsn);
CREATE INDEX idx_patients_name ON public.patients(full_name);
CREATE INDEX idx_patients_status ON public.patients(status);

-- ==============================================================================
-- 4. PATIENT ALLERGIES TABLE
-- ==============================================================================

CREATE TABLE public.patient_allergies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    
    allergen TEXT NOT NULL,
    reaction TEXT,
    severity TEXT CHECK (severity IN ('mild', 'moderate', 'severe', 'life-threatening')),
    verified BOOLEAN DEFAULT false,
    verified_by UUID REFERENCES public.profiles(id),
    verified_at TIMESTAMPTZ,
    
    source TEXT DEFAULT 'manual', -- 'manual', 'mpis', 'imported'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_allergies_patient ON public.patient_allergies(patient_id);

-- ==============================================================================
-- 5. PATIENT COMORBIDITIES TABLE
-- ==============================================================================

CREATE TABLE public.patient_comorbidities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    
    condition_name TEXT NOT NULL,
    icd10_code TEXT,
    diagnosed_date DATE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'controlled')),
    notes TEXT,
    
    source TEXT DEFAULT 'manual',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_comorbidities_patient ON public.patient_comorbidities(patient_id);

-- ==============================================================================
-- 6. PATIENT CURRENT MEDICATIONS TABLE
-- ==============================================================================

CREATE TABLE public.patient_medications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    
    medication_name TEXT NOT NULL,
    dosage TEXT,
    frequency TEXT,
    route TEXT, -- oral, IV, topical, etc.
    start_date DATE,
    end_date DATE,
    prescriber TEXT,
    is_active BOOLEAN DEFAULT true,
    
    source TEXT DEFAULT 'manual',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_medications_patient ON public.patient_medications(patient_id);
CREATE INDEX idx_medications_active ON public.patient_medications(patient_id, is_active);

-- ==============================================================================
-- 7. APPOINTMENTS TABLE
-- ==============================================================================

CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES public.profiles(id),
    
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    
    status appointment_status DEFAULT 'scheduled',
    priority priority_level DEFAULT 'normal',
    is_emergency BOOLEAN DEFAULT false,
    is_high_risk BOOLEAN DEFAULT false,
    
    -- Triage Information (filled by nurse)
    chief_complaint TEXT,
    triage_notes TEXT,
    triage_completed_at TIMESTAMPTZ,
    triage_completed_by UUID REFERENCES public.profiles(id),
    
    -- Appointment outcome
    consultation_started_at TIMESTAMPTZ,
    consultation_ended_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_appointments_date ON public.appointments(scheduled_date, scheduled_time);
CREATE INDEX idx_appointments_doctor ON public.appointments(doctor_id, scheduled_date);
CREATE INDEX idx_appointments_patient ON public.appointments(patient_id);
CREATE INDEX idx_appointments_status ON public.appointments(status);

-- ==============================================================================
-- 8. VITALS TABLE
-- ==============================================================================

CREATE TABLE public.vitals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    recorded_by UUID REFERENCES public.profiles(id),
    
    -- Blood Pressure
    bp_systolic INTEGER,
    bp_diastolic INTEGER,
    bp_status vital_status,
    
    -- Other Vitals
    heart_rate INTEGER,
    heart_rate_status vital_status,
    
    temperature DECIMAL(4,1), -- in Celsius
    temperature_status vital_status,
    
    oxygen_saturation INTEGER, -- SpO2 percentage
    spo2_status vital_status,
    
    respiratory_rate INTEGER,
    rr_status vital_status,
    
    -- Measurements
    weight DECIMAL(5,2), -- in kg
    height DECIMAL(5,2), -- in cm
    bmi DECIMAL(4,1) GENERATED ALWAYS AS (
        CASE WHEN height > 0 THEN ROUND((weight / ((height/100) * (height/100)))::numeric, 1) ELSE NULL END
    ) STORED,
    
    -- Pain Score (0-10)
    pain_score INTEGER CHECK (pain_score >= 0 AND pain_score <= 10),
    
    -- Blood Glucose
    blood_glucose DECIMAL(5,1), -- mmol/L
    glucose_fasting BOOLEAN,
    
    notes TEXT,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_vitals_patient ON public.vitals(patient_id, recorded_at DESC);
CREATE INDEX idx_vitals_appointment ON public.vitals(appointment_id);

-- ==============================================================================
-- 9. CLINICAL ENCOUNTERS / CONSULTATIONS TABLE
-- ==============================================================================

CREATE TABLE public.consultations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES public.profiles(id),
    appointment_id UUID REFERENCES public.appointments(id),
    vitals_id UUID REFERENCES public.vitals(id),
    
    -- Clinical Notes
    chief_complaint TEXT,
    history_of_present_illness TEXT,
    clinical_notes TEXT, -- Full clinical notes (can include voice transcription)
    examination_findings TEXT,
    
    -- AI Analysis
    ai_analysis_requested_at TIMESTAMPTZ,
    ai_analysis_completed_at TIMESTAMPTZ,
    ai_analysis_result JSONB, -- Stores differential diagnosis, confidence scores
    
    -- Status
    status TEXT DEFAULT 'in-progress' CHECK (status IN ('in-progress', 'pending-diagnosis', 'pending-care-plan', 'completed', 'cancelled')),
    
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_consultations_patient ON public.consultations(patient_id);
CREATE INDEX idx_consultations_doctor ON public.consultations(doctor_id);
CREATE INDEX idx_consultations_date ON public.consultations(created_at DESC);

-- ==============================================================================
-- 10. DIAGNOSES TABLE
-- ==============================================================================

CREATE TABLE public.diagnoses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    consultation_id UUID NOT NULL REFERENCES public.consultations(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    
    -- Diagnosis Details
    diagnosis_name TEXT NOT NULL,
    icd10_code TEXT,
    
    -- Classification
    diagnosis_type TEXT DEFAULT 'primary' CHECK (diagnosis_type IN ('primary', 'secondary', 'differential', 'rule-out')),
    probability DECIMAL(5,2), -- 0-100 percentage for AI-generated
    confidence_level TEXT CHECK (confidence_level IN ('low', 'moderate', 'high', 'confirmed')),
    
    -- Risk Assessment
    risk_level risk_level,
    risk_factors TEXT[],
    
    -- AI Generated
    is_ai_generated BOOLEAN DEFAULT false,
    ai_reasoning TEXT,
    
    -- Doctor Confirmation
    confirmed_by UUID REFERENCES public.profiles(id),
    confirmed_at TIMESTAMPTZ,
    is_confirmed BOOLEAN DEFAULT false,
    
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_diagnoses_consultation ON public.diagnoses(consultation_id);
CREATE INDEX idx_diagnoses_patient ON public.diagnoses(patient_id);
CREATE INDEX idx_diagnoses_icd10 ON public.diagnoses(icd10_code);

-- ==============================================================================
-- 11. CARE PLANS TABLE
-- ==============================================================================

CREATE TABLE public.care_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    consultation_id UUID NOT NULL REFERENCES public.consultations(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES public.profiles(id),
    diagnosis_id UUID REFERENCES public.diagnoses(id),
    
    -- Plan Status
    status care_plan_status DEFAULT 'draft',
    version INTEGER DEFAULT 1,
    
    -- Clinical Summary
    clinical_summary TEXT,
    
    -- AI Generated Content (stored as JSONB for flexibility)
    ai_generated_plan JSONB DEFAULT '{}'::jsonb,
    
    -- CPG References
    cpg_references JSONB DEFAULT '[]'::jsonb, -- Array of CPG citations
    
    -- Follow-up
    follow_up_date DATE,
    follow_up_notes TEXT,
    
    -- Approval Workflow
    submitted_at TIMESTAMPTZ,
    approved_by UUID REFERENCES public.profiles(id),
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    
    -- Export
    pdf_url TEXT,
    exported_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_care_plans_consultation ON public.care_plans(consultation_id);
CREATE INDEX idx_care_plans_patient ON public.care_plans(patient_id);
CREATE INDEX idx_care_plans_status ON public.care_plans(status);

-- ==============================================================================
-- 12. CARE PLAN MEDICATIONS TABLE
-- ==============================================================================

CREATE TABLE public.care_plan_medications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    care_plan_id UUID NOT NULL REFERENCES public.care_plans(id) ON DELETE CASCADE,
    
    medication_name TEXT NOT NULL,
    generic_name TEXT,
    dosage TEXT NOT NULL,
    frequency TEXT NOT NULL,
    route TEXT,
    duration TEXT,
    
    action medication_action NOT NULL, -- START, STOP, CONTINUE, MODIFY
    reason TEXT,
    
    -- Clinical Decision Support flags
    has_interaction_warning BOOLEAN DEFAULT false,
    has_allergy_warning BOOLEAN DEFAULT false,
    has_contraindication BOOLEAN DEFAULT false,
    cds_alerts JSONB DEFAULT '[]'::jsonb,
    
    -- Doctor modifications
    is_modified BOOLEAN DEFAULT false,
    original_recommendation JSONB,
    modification_reason TEXT,
    
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_care_plan_meds ON public.care_plan_medications(care_plan_id);

-- ==============================================================================
-- 13. CARE PLAN INTERVENTIONS TABLE
-- ==============================================================================

CREATE TABLE public.care_plan_interventions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    care_plan_id UUID NOT NULL REFERENCES public.care_plans(id) ON DELETE CASCADE,
    
    intervention_type TEXT NOT NULL, -- 'lifestyle', 'monitoring', 'education', 'referral', 'procedure'
    description TEXT NOT NULL,
    ichi_code TEXT, -- International Classification of Health Interventions
    
    priority priority_level DEFAULT 'normal',
    frequency TEXT,
    duration TEXT,
    
    assigned_to TEXT, -- Role or specific person
    target_date DATE,
    
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_care_plan_interventions ON public.care_plan_interventions(care_plan_id);

-- ==============================================================================
-- 14. CARE PLAN INVESTIGATIONS (LAB ORDERS) TABLE
-- ==============================================================================

CREATE TABLE public.care_plan_investigations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    care_plan_id UUID NOT NULL REFERENCES public.care_plans(id) ON DELETE CASCADE,
    
    investigation_name TEXT NOT NULL,
    investigation_code TEXT, -- LOINC or local code
    category TEXT, -- 'laboratory', 'imaging', 'procedure', 'other'
    
    urgency TEXT DEFAULT 'routine' CHECK (urgency IN ('routine', 'urgent', 'stat')),
    rationale TEXT,
    
    fasting_required BOOLEAN DEFAULT false,
    special_instructions TEXT,
    
    ordered_at TIMESTAMPTZ,
    result_received_at TIMESTAMPTZ,
    result_value TEXT,
    result_status TEXT CHECK (result_status IN ('pending', 'received', 'reviewed', 'abnormal')),
    
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_care_plan_investigations ON public.care_plan_investigations(care_plan_id);

-- ==============================================================================
-- 15. CLINICAL DECISION SUPPORT (CDS) ALERTS LOG
-- ==============================================================================

CREATE TABLE public.cds_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    consultation_id UUID REFERENCES public.consultations(id) ON DELETE SET NULL,
    care_plan_id UUID REFERENCES public.care_plans(id) ON DELETE SET NULL,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    
    alert_type TEXT NOT NULL, -- 'drug-interaction', 'allergy', 'contraindication', 'dosage'
    severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
    
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    recommendation TEXT,
    
    -- Related entities
    medication_name TEXT,
    interacting_with TEXT,
    allergy_trigger TEXT,
    
    -- Action taken
    acknowledged_by UUID REFERENCES public.profiles(id),
    acknowledged_at TIMESTAMPTZ,
    action_taken TEXT,
    override_reason TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cds_alerts_consultation ON public.cds_alerts(consultation_id);
CREATE INDEX idx_cds_alerts_care_plan ON public.cds_alerts(care_plan_id);
CREATE INDEX idx_cds_alerts_patient ON public.cds_alerts(patient_id);

-- ==============================================================================
-- 16. AUDIT LOG TABLE
-- ==============================================================================

CREATE TABLE public.audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    user_id UUID REFERENCES public.profiles(id),
    action TEXT NOT NULL, -- 'create', 'read', 'update', 'delete', 'export', 'print'
    
    table_name TEXT NOT NULL,
    record_id UUID,
    
    old_values JSONB,
    new_values JSONB,
    
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_log_user ON public.audit_log(user_id);
CREATE INDEX idx_audit_log_table ON public.audit_log(table_name, record_id);
CREATE INDEX idx_audit_log_date ON public.audit_log(created_at DESC);

-- ==============================================================================
-- 17. ANALYTICS / USAGE METRICS TABLE
-- ==============================================================================

CREATE TABLE public.usage_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    doctor_id UUID REFERENCES public.profiles(id),
    metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Daily counters
    consultations_count INTEGER DEFAULT 0,
    care_plans_generated INTEGER DEFAULT 0,
    care_plans_approved INTEGER DEFAULT 0,
    care_plans_modified INTEGER DEFAULT 0,
    ai_suggestions_accepted INTEGER DEFAULT 0,
    ai_suggestions_rejected INTEGER DEFAULT 0,
    cds_alerts_triggered INTEGER DEFAULT 0,
    cds_alerts_overridden INTEGER DEFAULT 0,
    
    -- Timing metrics (in seconds)
    avg_consultation_time INTEGER,
    avg_care_plan_generation_time INTEGER,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(doctor_id, metric_date)
);

CREATE INDEX idx_usage_metrics_doctor ON public.usage_metrics(doctor_id, metric_date DESC);

-- ==============================================================================
-- FUNCTIONS
-- ==============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-calculate vital status
CREATE OR REPLACE FUNCTION calculate_vital_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Blood Pressure Status
    IF NEW.bp_systolic IS NOT NULL AND NEW.bp_diastolic IS NOT NULL THEN
        IF NEW.bp_systolic >= 180 OR NEW.bp_diastolic >= 120 THEN
            NEW.bp_status = 'critical';
        ELSIF NEW.bp_systolic >= 140 OR NEW.bp_diastolic >= 90 THEN
            NEW.bp_status = 'high';
        ELSIF NEW.bp_systolic < 90 OR NEW.bp_diastolic < 60 THEN
            NEW.bp_status = 'low';
        ELSE
            NEW.bp_status = 'normal';
        END IF;
    END IF;
    
    -- Heart Rate Status
    IF NEW.heart_rate IS NOT NULL THEN
        IF NEW.heart_rate > 120 OR NEW.heart_rate < 40 THEN
            NEW.heart_rate_status = 'critical';
        ELSIF NEW.heart_rate > 100 OR NEW.heart_rate < 50 THEN
            NEW.heart_rate_status = 'high';
        ELSE
            NEW.heart_rate_status = 'normal';
        END IF;
    END IF;
    
    -- Temperature Status (Celsius)
    IF NEW.temperature IS NOT NULL THEN
        IF NEW.temperature >= 39.5 OR NEW.temperature < 35 THEN
            NEW.temperature_status = 'critical';
        ELSIF NEW.temperature >= 38 THEN
            NEW.temperature_status = 'high';
        ELSIF NEW.temperature < 36 THEN
            NEW.temperature_status = 'low';
        ELSE
            NEW.temperature_status = 'normal';
        END IF;
    END IF;
    
    -- SpO2 Status
    IF NEW.oxygen_saturation IS NOT NULL THEN
        IF NEW.oxygen_saturation < 90 THEN
            NEW.spo2_status = 'critical';
        ELSIF NEW.oxygen_saturation < 94 THEN
            NEW.spo2_status = 'low';
        ELSE
            NEW.spo2_status = 'normal';
        END IF;
    END IF;
    
    -- Respiratory Rate Status
    IF NEW.respiratory_rate IS NOT NULL THEN
        IF NEW.respiratory_rate > 30 OR NEW.respiratory_rate < 8 THEN
            NEW.rr_status = 'critical';
        ELSIF NEW.respiratory_rate > 20 OR NEW.respiratory_rate < 12 THEN
            NEW.rr_status = 'high';
        ELSE
            NEW.rr_status = 'normal';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate patient risk level
CREATE OR REPLACE FUNCTION calculate_patient_risk()
RETURNS TRIGGER AS $$
DECLARE
    comorbidity_count INTEGER;
    high_risk_conditions TEXT[] := ARRAY['diabetes', 'hypertension', 'heart', 'kidney', 'cancer', 'copd', 'stroke'];
    has_high_risk BOOLEAN := false;
    condition TEXT;
BEGIN
    -- Count comorbidities
    SELECT COUNT(*) INTO comorbidity_count
    FROM public.patient_comorbidities
    WHERE patient_id = NEW.patient_id AND status = 'active';
    
    -- Check for high-risk conditions
    FOR condition IN
        SELECT LOWER(condition_name)
        FROM public.patient_comorbidities
        WHERE patient_id = NEW.patient_id AND status = 'active'
    LOOP
        IF condition ~ ANY(high_risk_conditions) THEN
            has_high_risk := true;
            EXIT;
        END IF;
    END LOOP;
    
    -- Update patient risk level
    UPDATE public.patients
    SET risk_level = CASE
        WHEN has_high_risk AND comorbidity_count >= 3 THEN 'critical'
        WHEN has_high_risk OR comorbidity_count >= 3 THEN 'high'
        WHEN comorbidity_count >= 2 THEN 'moderate'
        ELSE 'low'
    END,
    updated_at = NOW()
    WHERE id = NEW.patient_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO public.audit_log (user_id, action, table_name, record_id, old_values)
        VALUES (auth.uid(), 'delete', TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO public.audit_log (user_id, action, table_name, record_id, old_values, new_values)
        VALUES (auth.uid(), 'update', TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO public.audit_log (user_id, action, table_name, record_id, new_values)
        VALUES (auth.uid(), 'create', TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update usage metrics
CREATE OR REPLACE FUNCTION update_usage_metrics(
    p_doctor_id UUID,
    p_metric TEXT,
    p_increment INTEGER DEFAULT 1
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.usage_metrics (doctor_id, metric_date)
    VALUES (p_doctor_id, CURRENT_DATE)
    ON CONFLICT (doctor_id, metric_date) DO NOTHING;
    
    EXECUTE format(
        'UPDATE public.usage_metrics SET %I = COALESCE(%I, 0) + $1, updated_at = NOW() WHERE doctor_id = $2 AND metric_date = CURRENT_DATE',
        p_metric, p_metric
    ) USING p_increment, p_doctor_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- TRIGGERS
-- ==============================================================================

-- Updated_at triggers
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at
    BEFORE UPDATE ON public.patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON public.appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patient_medications_updated_at
    BEFORE UPDATE ON public.patient_medications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultations_updated_at
    BEFORE UPDATE ON public.consultations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_care_plans_updated_at
    BEFORE UPDATE ON public.care_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Vital status auto-calculation trigger
CREATE TRIGGER calculate_vitals_status
    BEFORE INSERT OR UPDATE ON public.vitals
    FOR EACH ROW EXECUTE FUNCTION calculate_vital_status();

-- Patient risk level recalculation trigger
CREATE TRIGGER recalculate_patient_risk
    AFTER INSERT OR UPDATE OR DELETE ON public.patient_comorbidities
    FOR EACH ROW EXECUTE FUNCTION calculate_patient_risk();

-- Create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Audit logging triggers (for sensitive tables)
CREATE TRIGGER audit_patients
    AFTER INSERT OR UPDATE OR DELETE ON public.patients
    FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_consultations
    AFTER INSERT OR UPDATE OR DELETE ON public.consultations
    FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_care_plans
    AFTER INSERT OR UPDATE OR DELETE ON public.care_plans
    FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_diagnoses
    AFTER INSERT OR UPDATE OR DELETE ON public.diagnoses
    FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_comorbidities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_plan_medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_plan_interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_plan_investigations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cds_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_metrics ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view all profiles, but only edit their own
CREATE POLICY "Profiles are viewable by authenticated users"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

-- Patients: All authenticated medical staff can view/edit patients
CREATE POLICY "Patients viewable by authenticated users"
    ON public.patients FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Patients editable by authenticated users"
    ON public.patients FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Patients updatable by authenticated users"
    ON public.patients FOR UPDATE
    TO authenticated
    USING (true);

-- Similar policies for related patient data
CREATE POLICY "Patient allergies viewable by authenticated"
    ON public.patient_allergies FOR ALL
    TO authenticated
    USING (true);

CREATE POLICY "Patient comorbidities viewable by authenticated"
    ON public.patient_comorbidities FOR ALL
    TO authenticated
    USING (true);

CREATE POLICY "Patient medications viewable by authenticated"
    ON public.patient_medications FOR ALL
    TO authenticated
    USING (true);

-- Appointments: Doctors can see all, manage their own
CREATE POLICY "Appointments viewable by authenticated"
    ON public.appointments FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Appointments manageable by assigned doctor"
    ON public.appointments FOR ALL
    TO authenticated
    USING (doctor_id = auth.uid() OR true); -- Allow all for now

-- Vitals: All authenticated can view/create
CREATE POLICY "Vitals accessible by authenticated"
    ON public.vitals FOR ALL
    TO authenticated
    USING (true);

-- Consultations: Doctor can manage their own
CREATE POLICY "Consultations viewable by authenticated"
    ON public.consultations FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Consultations manageable by doctor"
    ON public.consultations FOR INSERT
    TO authenticated
    WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Consultations updatable by doctor"
    ON public.consultations FOR UPDATE
    TO authenticated
    USING (doctor_id = auth.uid());

-- Care Plans: Doctor can manage their own
CREATE POLICY "Care plans viewable by authenticated"
    ON public.care_plans FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Care plans manageable by doctor"
    ON public.care_plans FOR INSERT
    TO authenticated
    WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Care plans updatable by doctor"
    ON public.care_plans FOR UPDATE
    TO authenticated
    USING (doctor_id = auth.uid());

-- Diagnoses, Care Plan components
CREATE POLICY "Diagnoses accessible by authenticated"
    ON public.diagnoses FOR ALL
    TO authenticated
    USING (true);

CREATE POLICY "Care plan medications accessible"
    ON public.care_plan_medications FOR ALL
    TO authenticated
    USING (true);

CREATE POLICY "Care plan interventions accessible"
    ON public.care_plan_interventions FOR ALL
    TO authenticated
    USING (true);

CREATE POLICY "Care plan investigations accessible"
    ON public.care_plan_investigations FOR ALL
    TO authenticated
    USING (true);

-- CDS Alerts
CREATE POLICY "CDS alerts accessible by authenticated"
    ON public.cds_alerts FOR ALL
    TO authenticated
    USING (true);

-- Audit log: Read only for admins (via service role), insert for system
CREATE POLICY "Audit log insert only"
    ON public.audit_log FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Usage metrics: Doctors see their own
CREATE POLICY "Usage metrics viewable by owner"
    ON public.usage_metrics FOR SELECT
    TO authenticated
    USING (doctor_id = auth.uid());

CREATE POLICY "Usage metrics updatable by system"
    ON public.usage_metrics FOR ALL
    TO authenticated
    USING (true);

-- ==============================================================================
-- STORAGE BUCKET POLICIES (Run in Supabase Dashboard → Storage → Policies)
-- ==============================================================================
-- 
-- For bucket: patient-documents
-- SELECT policy: auth.role() = 'authenticated'
-- INSERT policy: auth.role() = 'authenticated'
-- UPDATE policy: auth.role() = 'authenticated'
-- DELETE policy: auth.role() = 'authenticated'
--
-- For bucket: profile-avatars
-- SELECT policy: true (public)
-- INSERT policy: auth.uid()::text = (storage.foldername(name))[1]
-- UPDATE policy: auth.uid()::text = (storage.foldername(name))[1]
-- DELETE policy: auth.uid()::text = (storage.foldername(name))[1]
--
-- For bucket: care-plan-exports
-- SELECT policy: auth.role() = 'authenticated'
-- INSERT policy: auth.role() = 'authenticated'
-- DELETE policy: auth.role() = 'authenticated'

-- ==============================================================================
-- SAMPLE DATA (OPTIONAL - for testing)
-- ==============================================================================

-- Insert will happen after first user signup, or you can manually add via dashboard

COMMENT ON SCHEMA public IS 'MHNexus CPG-LLM Application Schema';
