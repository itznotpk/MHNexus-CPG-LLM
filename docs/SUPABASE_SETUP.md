# MHNexus CPG-LLM - Supabase Integration Guide

## 📋 Quick Setup

### Step 1: Create Supabase Project
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Choose organization, name your project (e.g., `mhnexus-cpg`)
4. Set a strong database password (save this!)
5. Choose region closest to your users
6. Click "Create new project" (takes ~2 minutes)

### Step 2: Get API Keys
1. Go to **Project Settings** → **API**
2. Copy these values:

| Key | Location | Description |
|-----|----------|-------------|
| `Project URL` | Under "Project URL" | Your unique Supabase endpoint |
| `anon/public` | Under "Project API keys" | Public key for client-side |
| `service_role` | Under "Project API keys" | ⚠️ SECRET - server-side only |

### Step 3: Configure Environment
Edit your `.env` file:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 4: Run Database Schema
1. Go to **SQL Editor** in Supabase Dashboard
2. Click **New Query**
3. Copy entire contents of `supabase/schema.sql`
4. Click **Run** (takes ~5 seconds)

### Step 5: Create Storage Buckets
1. Go to **Storage** in Supabase Dashboard
2. Create these buckets:

| Bucket Name | Public | Description |
|------------|--------|-------------|
| `patient-documents` | No | Medical documents, lab results |
| `profile-avatars` | Yes | User profile pictures |
| `care-plan-exports` | No | Generated PDF care plans |

---

## 📊 Database Tables Reference

### Core Tables

#### 1. `profiles` (User/Doctor Accounts)
Extends Supabase Auth - auto-created on signup.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Links to auth.users |
| `email` | TEXT | User email |
| `full_name` | TEXT | Display name |
| `title` | TEXT | Dr., Prof., etc. |
| `specialty` | TEXT | Medical specialty |
| `license_number` | TEXT | Medical license |
| `phone` | TEXT | Contact number |
| `facility` | TEXT | Hospital/clinic name |
| `department` | TEXT | Department name |
| `avatar_url` | TEXT | Profile picture URL |
| `role` | TEXT | doctor/nurse/admin/pharmacist |
| `settings` | JSONB | Theme, notifications, etc. |

#### 2. `patients` (Patient Registry)
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Unique patient ID |
| `nsn` | TEXT (unique) | National Health Number |
| `full_name` | TEXT | Patient name |
| `date_of_birth` | DATE | DOB |
| `age` | INTEGER | Auto-calculated from DOB |
| `gender` | ENUM | male/female/other |
| `phone` | TEXT | Phone number |
| `email` | TEXT | Email |
| `address` | TEXT | Full address |
| `emergency_contact_*` | TEXT | Emergency contact details |
| `mrn` | TEXT | Medical Record Number |
| `status` | ENUM | active/discharged/follow-up/deceased |
| `risk_level` | ENUM | low/moderate/high/critical |
| `mpis_data` | JSONB | External system data |

#### 3. `patient_allergies`
| Column | Type | Description |
|--------|------|-------------|
| `patient_id` | UUID (FK) | Reference to patient |
| `allergen` | TEXT | Allergen name |
| `reaction` | TEXT | Reaction description |
| `severity` | TEXT | mild/moderate/severe/life-threatening |
| `verified` | BOOLEAN | Clinically verified |

#### 4. `patient_comorbidities`
| Column | Type | Description |
|--------|------|-------------|
| `patient_id` | UUID (FK) | Reference to patient |
| `condition_name` | TEXT | Condition name |
| `icd10_code` | TEXT | ICD-10 classification |
| `diagnosed_date` | DATE | When diagnosed |
| `status` | TEXT | active/resolved/controlled |

#### 5. `patient_medications`
| Column | Type | Description |
|--------|------|-------------|
| `patient_id` | UUID (FK) | Reference to patient |
| `medication_name` | TEXT | Drug name |
| `dosage` | TEXT | Dosage amount |
| `frequency` | TEXT | How often |
| `route` | TEXT | oral/IV/topical/etc. |
| `is_active` | BOOLEAN | Currently taking |

---

### Clinical Workflow Tables

#### 6. `appointments`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Appointment ID |
| `patient_id` | UUID (FK) | Patient reference |
| `doctor_id` | UUID (FK) | Doctor reference |
| `scheduled_date` | DATE | Appointment date |
| `scheduled_time` | TIME | Appointment time |
| `duration_minutes` | INTEGER | Duration (default 30) |
| `status` | ENUM | scheduled/waiting/in-progress/completed/cancelled/no-show |
| `priority` | ENUM | low/normal/high/urgent/emergency |
| `is_emergency` | BOOLEAN | Emergency flag |
| `chief_complaint` | TEXT | Reason for visit |
| `triage_notes` | TEXT | Nurse triage notes |

#### 7. `vitals`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Vital record ID |
| `patient_id` | UUID (FK) | Patient reference |
| `appointment_id` | UUID (FK) | Optional appointment link |
| `bp_systolic` | INTEGER | Blood pressure systolic |
| `bp_diastolic` | INTEGER | Blood pressure diastolic |
| `bp_status` | ENUM | Auto-calculated: normal/high/low/critical |
| `heart_rate` | INTEGER | Heart rate (bpm) |
| `temperature` | DECIMAL | Temperature (°C) |
| `oxygen_saturation` | INTEGER | SpO2 (%) |
| `respiratory_rate` | INTEGER | Breaths per minute |
| `weight` | DECIMAL | Weight (kg) |
| `height` | DECIMAL | Height (cm) |
| `bmi` | DECIMAL | Auto-calculated |
| `pain_score` | INTEGER | 0-10 scale |
| `blood_glucose` | DECIMAL | mmol/L |

#### 8. `consultations`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Consultation ID |
| `patient_id` | UUID (FK) | Patient reference |
| `doctor_id` | UUID (FK) | Doctor reference |
| `chief_complaint` | TEXT | Chief complaint |
| `history_of_present_illness` | TEXT | HPI |
| `clinical_notes` | TEXT | Full clinical notes |
| `examination_findings` | TEXT | Physical exam findings |
| `ai_analysis_result` | JSONB | AI differential diagnosis |
| `status` | TEXT | in-progress/pending-diagnosis/pending-care-plan/completed |

---

### Diagnosis & Care Plan Tables

#### 9. `diagnoses`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Diagnosis ID |
| `consultation_id` | UUID (FK) | Consultation reference |
| `patient_id` | UUID (FK) | Patient reference |
| `diagnosis_name` | TEXT | Diagnosis name |
| `icd10_code` | TEXT | ICD-10 code |
| `diagnosis_type` | TEXT | primary/secondary/differential/rule-out |
| `probability` | DECIMAL | AI confidence (0-100%) |
| `risk_level` | ENUM | low/moderate/high/critical |
| `is_ai_generated` | BOOLEAN | From AI or manual |
| `ai_reasoning` | TEXT | AI explanation |
| `is_confirmed` | BOOLEAN | Doctor confirmed |

#### 10. `care_plans`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Care plan ID |
| `consultation_id` | UUID (FK) | Consultation reference |
| `patient_id` | UUID (FK) | Patient reference |
| `doctor_id` | UUID (FK) | Doctor reference |
| `diagnosis_id` | UUID (FK) | Primary diagnosis |
| `status` | ENUM | draft/pending-approval/approved/active/completed/cancelled |
| `clinical_summary` | TEXT | Summary for patient |
| `ai_generated_plan` | JSONB | Full AI-generated plan |
| `cpg_references` | JSONB | Clinical guideline citations |
| `follow_up_date` | DATE | Next appointment |
| `pdf_url` | TEXT | Exported PDF URL |

#### 11. `care_plan_medications`
| Column | Type | Description |
|--------|------|-------------|
| `care_plan_id` | UUID (FK) | Care plan reference |
| `medication_name` | TEXT | Drug name |
| `dosage` | TEXT | Dosage |
| `frequency` | TEXT | Frequency |
| `route` | TEXT | Administration route |
| `duration` | TEXT | Duration |
| `action` | ENUM | start/stop/continue/modify |
| `has_interaction_warning` | BOOLEAN | Drug interaction flag |
| `has_allergy_warning` | BOOLEAN | Allergy alert |
| `cds_alerts` | JSONB | CDS alert details |

#### 12. `care_plan_interventions`
| Column | Type | Description |
|--------|------|-------------|
| `care_plan_id` | UUID (FK) | Care plan reference |
| `intervention_type` | TEXT | lifestyle/monitoring/education/referral/procedure |
| `description` | TEXT | Intervention details |
| `priority` | ENUM | low/normal/high/urgent |

#### 13. `care_plan_investigations`
| Column | Type | Description |
|--------|------|-------------|
| `care_plan_id` | UUID (FK) | Care plan reference |
| `investigation_name` | TEXT | Test name |
| `category` | TEXT | laboratory/imaging/procedure |
| `urgency` | TEXT | routine/urgent/stat |
| `result_status` | TEXT | pending/received/reviewed/abnormal |

---

### System Tables

#### 14. `cds_alerts` (Clinical Decision Support)
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Alert ID |
| `consultation_id` | UUID (FK) | Related consultation |
| `patient_id` | UUID (FK) | Patient reference |
| `alert_type` | TEXT | drug-interaction/allergy/contraindication/dosage |
| `severity` | TEXT | info/warning/critical |
| `title` | TEXT | Alert title |
| `description` | TEXT | Full description |
| `acknowledged_by` | UUID (FK) | Doctor who acknowledged |
| `override_reason` | TEXT | Why overridden |

#### 15. `audit_log`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Log entry ID |
| `user_id` | UUID (FK) | Who performed action |
| `action` | TEXT | create/read/update/delete/export |
| `table_name` | TEXT | Affected table |
| `record_id` | UUID | Affected record |
| `old_values` | JSONB | Previous values |
| `new_values` | JSONB | New values |

#### 16. `usage_metrics`
| Column | Type | Description |
|--------|------|-------------|
| `doctor_id` | UUID (FK) | Doctor reference |
| `metric_date` | DATE | Date of metrics |
| `consultations_count` | INTEGER | Daily consultation count |
| `care_plans_generated` | INTEGER | Plans generated |
| `ai_suggestions_accepted` | INTEGER | AI acceptance rate |

---

## ⚙️ Database Functions

| Function | Purpose |
|----------|---------|
| `update_updated_at_column()` | Auto-updates `updated_at` timestamp |
| `calculate_vital_status()` | Auto-calculates vital sign status (normal/high/low/critical) |
| `calculate_patient_risk()` | Recalculates patient risk level based on comorbidities |
| `handle_new_user()` | Creates profile when user signs up |
| `log_audit_event()` | Logs all changes to sensitive tables |
| `update_usage_metrics()` | Updates daily usage counters |

---

## 🔐 Row Level Security (RLS)

All tables have RLS enabled with these policies:

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| profiles | All authenticated | - | Own only | - |
| patients | All authenticated | All authenticated | All authenticated | - |
| appointments | All authenticated | All authenticated | All authenticated | - |
| consultations | All authenticated | Own only | Own only | - |
| care_plans | All authenticated | Own only | Own only | - |
| audit_log | - | System only | - | - |

---

## 📁 Storage Buckets

### 1. `patient-documents`
- **Access**: Authenticated only
- **Purpose**: Medical documents, lab results, imaging
- **Structure**: `/{patient_id}/{document_type}/{filename}`

### 2. `profile-avatars`
- **Access**: Public read, owner write
- **Purpose**: User profile pictures
- **Structure**: `/{user_id}/avatar.{ext}`

### 3. `care-plan-exports`
- **Access**: Authenticated only
- **Purpose**: Generated PDF care plans
- **Structure**: `/{care_plan_id}/care-plan-{timestamp}.pdf`

---

## 🚀 Next Steps

1. ✅ Install Supabase client (`@supabase/supabase-js`)
2. ✅ Configure `.env` with your API keys
3. ✅ Run `schema.sql` in Supabase SQL Editor
4. ⬜ Create storage buckets
5. ⬜ Set up authentication (email/password or OAuth)
6. ⬜ Connect React components to Supabase

---

## 🔗 Useful Links

- [Supabase Dashboard](https://app.supabase.com)
- [Supabase Docs](https://supabase.com/docs)
- [JavaScript Client Docs](https://supabase.com/docs/reference/javascript)
- [RLS Policies Guide](https://supabase.com/docs/guides/auth/row-level-security)
