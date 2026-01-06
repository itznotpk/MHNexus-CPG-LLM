# MHNexus CPG LLM Web Application

A modern, AI-powered Clinical Practice Guideline (CPG) web application built with React, Vite, Tailwind CSS, and Supabase. This application assists healthcare providers in generating evidence-based care plans using AI recommendations, with a comprehensive dashboard and patient management system.

![MHNexus CPG LLM](https://img.shields.io/badge/MHNexus-CPG%20LLM-0b5e3c?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=flat-square&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat-square&logo=supabase)

## 🌟 Features

### 🏠 Sidebar Navigation & Dashboard

#### Dashboard
- **Today's Schedule**: Visual timeline of patient appointments
- **Quick Stats**: Consultations completed, pending reviews, patients seen
- **Patient Cards**: Color-coded by priority (emergency, follow-up, regular)
- **Start Consult**: One-click access to begin patient consultation
- **Waiting Room Preview**: Triage queue with status indicators

#### My Patients
- **Patient Registry**: Searchable patient database
- **Status Filters**: Active, Follow-up, Discharged tabs
- **Quick Actions**: View history, schedule appointment, start consult
- **Risk Indicators**: Visual badges for patient risk levels
- **Expandable Details**: Full patient info without leaving the page

#### Settings
- **Profile Management**: Name, specialty, license, contact info
- **Notifications**: Email, push, SMS, emergency alert preferences
- **Appearance**: Light/Dark/System theme with 6 accent colors (Cyan, Blue, Purple, Emerald, Amber, Rose)
- **System Config**: Session timeout, auto-save, data sync settings

### 🔄 Core Workflow (4-Step Process)

#### 1. Data Input Section
- **Patient Demographics**: Name, MRN, Age, Gender, DOB, Blood Type
- **MPIS Integration**: Mock sync with Malaysian Patient Information System
- **Vitals Grid**: BP, Heart Rate, Temperature, SpO2, Respiratory Rate, Weight, Height, BMI (auto-calculated)
- **Clinical Notes**: Free-text input with voice dictation support
- **Known Allergies & Current Medications**: Structured input fields

#### 2. AI Diagnosis Section
- **AI-Generated Differential Diagnoses**: Ranked by probability
- **ICD-10 Codes**: Automatically assigned to each diagnosis
- **Risk Assessment Badges**: High/Medium/Low risk indicators
- **Selectable Diagnoses**: Click to select any diagnosis for care plan generation

#### 3. Care Plan Section
- **Clinical Assessment Summary**: AI-generated overview
- **Interventions & Procedures**: With CPT codes and urgency levels
- **Pharmacological Management**: 
  - STOP medications (with reasons)
  - START medications (with dosing instructions)
  - CONTINUE medications
- **Monitoring & Nursing Care**: Checklist format
- **Laboratory Investigations**: With priority levels
- **Disposition & Follow-up**: Referrals and patient education
- **CPG References**: Evidence-based guideline citations

#### 4. Output Section
- **Complete Care Plan Summary**: Finalized recommendations
- **PDF Export**: Generate downloadable care plan documents
- **Print Support**: Browser print functionality

### 🆕 Advanced Features

#### Clinical Decision Support (CDS)
- **Drug Interaction Checker**: Alerts for dangerous combinations
- **Allergy Alerts**: Cross-references patient allergies with prescribed medications
- **Contraindication Warnings**: Condition-based medication alerts
- **Dosage Calculator**: eGFR-based renal dosing adjustments

#### Enhanced AI Interaction
- **Regenerate Care Plan**: Request alternative recommendations
- **Feedback Options**: More Conservative, More Aggressive, Different Approach, etc.
- **Custom Feedback Input**: Free-text feedback for RAG improvement

#### Voice & Dictation
- **Speech-to-Text**: Voice input for clinical notes (Web Speech API)
- **Read Aloud**: Text-to-speech for care plan summaries
- **Real-time Transcription Preview**

#### Approval Workflow
- **Three-Stage Process**: Draft → Reviewed → Approved
- **Comment Field**: Add notes for each transition
- **History Tracking**: Audit trail with timestamps
- **Approval Required**: Finalization locked until approved

#### Analytics Dashboard
- **Usage Metrics**: Total sessions, weekly trends
- **Time Saved**: Efficiency calculations
- **Acceptance Rate**: Care plan recommendation adoption
- **Top Diagnoses**: Frequency breakdown
- **Recent Activity Feed**: Real-time usage log
- **AI Performance Metrics**: Confidence scores, active users

## 🎨 Design System

### Theme System
- **Light/Dark/System Modes**: Automatic theme detection or manual selection
- **6 Accent Colors**: Cyan (default), Blue, Purple, Emerald, Amber, Rose
- **CSS Custom Properties**: Dynamic theming via `--accent-primary`, `--accent-hover`, `--accent-secondary`
- **LocalStorage Persistence**: Theme and accent preferences saved across sessions

### Visual Design
- **Glassmorphism UI**: Modern translucent card design with blur effects
- **Color Palette**: 
  - Light Mode: White backgrounds with subtle shadows
  - Dark Mode: Slate-900 backgrounds with gradient accents
- **Typography**: Optimized contrast for both themes
- **Responsive**: Mobile-first design approach with collapsible sidebar

### UI Components
- GlassCard, GlassPanel (glassmorphism containers)
- Button (primary, secondary, success, danger, ghost, outline)
- Badge (status, confidence, risk, code)
- Input, TextArea, Select (form controls)
- ProgressBar, StepIndicator (navigation)
- Skeleton loaders (loading states)

## 📁 Project Structure

```
src/
├── App.jsx                 # Main application with sidebar routing
├── main.jsx                # React entry point
├── index.css               # Tailwind CSS + theme variables
├── components/
│   ├── layout/
│   │   ├── Layout.jsx      # Header & Footer components
│   │   ├── Sidebar.jsx     # Collapsible navigation sidebar
│   │   └── index.js
│   ├── pages/
│   │   ├── Dashboard.jsx   # Main dashboard with schedule
│   │   ├── MyPatients.jsx  # Patient registry & search
│   │   └── Settings.jsx    # User preferences & config
│   ├── sections/
│   │   ├── DataInputSection.jsx
│   │   ├── DiagnosisSection.jsx
│   │   ├── CarePlanSection.jsx
│   │   ├── OutputSection.jsx
│   │   ├── DashboardSection.jsx
│   │   ├── ClinicalDecisionSupport.jsx
│   │   ├── PatientDemographics.jsx
│   │   ├── ClinicalNotes.jsx
│   │   ├── VitalsGrid.jsx
│   │   ├── MPISSync.jsx
│   │   └── index.js
│   └── shared/
│       ├── GlassCard.jsx
│       ├── Button.jsx
│       ├── Input.jsx
│       ├── Badge.jsx
│       ├── ProgressBar.jsx
│       ├── VoiceInput.jsx
│       ├── NotesComments.jsx
│       ├── ApprovalWorkflow.jsx
│       ├── RegenerateButton.jsx
│       └── index.js
├── context/
│   ├── AppContext.jsx      # Global state management
│   └── ThemeContext.jsx    # Theme & accent color management
├── data/
│   ├── sampleData.js       # Demo data for testing
│   ├── clinicalRulesData.js # CDS rules database
│   └── scheduleData.js     # Dashboard mock data
├── lib/
│   └── supabase.js         # Supabase client configuration
└── utils/
    └── pdfGenerator.js     # PDF export functionality

supabase/
└── schema.sql              # Complete database schema

docs/
└── SUPABASE_SETUP.md       # Backend setup guide
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd "MHNexus CPG LLM Web App"
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📦 Dependencies

### Production Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.2.0 | UI framework |
| react-dom | ^18.2.0 | React DOM rendering |
| lucide-react | ^0.294.0 | Icon library |
| jspdf | ^2.5.2 | PDF generation |
| jspdf-autotable | ^3.8.4 | PDF table formatting || @supabase/supabase-js | ^2.89.0 | Backend integration |
### Development Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| vite | ^5.0.8 | Build tool & dev server |
| @vitejs/plugin-react | ^4.2.1 | React plugin for Vite |
| tailwindcss | ^3.3.6 | CSS framework |
| postcss | ^8.4.32 | CSS processing |
| autoprefixer | ^10.4.16 | CSS vendor prefixes |

## 🔧 Configuration Files

- `vite.config.js` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS customization
- `postcss.config.js` - PostCSS plugins
- `package.json` - Project dependencies and scripts

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Note**: Voice features require browser support for Web Speech API.

## � Supabase Backend Integration

The application includes complete Supabase backend setup:

### Database Schema (16 Tables)
- **profiles**: User/doctor accounts with settings
- **patients**: Patient registry with demographics
- **patient_allergies/comorbidities/medications**: Patient medical data
- **appointments**: Scheduling with triage support
- **vitals**: Vital signs with auto-status calculation
- **consultations**: Clinical encounters
- **diagnoses**: AI and manual diagnoses
- **care_plans**: Treatment plans with AI integration
- **care_plan_medications/interventions/investigations**: Plan components
- **cds_alerts**: Clinical decision support alerts
- **audit_log**: Complete action tracking
- **usage_metrics**: Analytics and performance data

### Storage Buckets
- `patient-documents`: Medical documents and lab results
- `profile-avatars`: User profile pictures
- `care-plan-exports`: Generated PDF care plans

### Setup Instructions
See [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md) for complete setup guide.

## 🔮 Planned Integrations

- **AI/LLM Integration**: Diagnosis and care plan generation
- **MPIS API**: Malaysian Patient Information System sync
- **RAG System**: Feedback loop for AI improvement

## 📄 License

Proprietary - MHNexus Healthcare Solutions

## 👥 Team

- **MHNexus Development Team**
- Chua Zhu Heng (Leader)
- Chin Pei Kang
- Lim Zhi Pin
- Low Jia Qi
- Satish Rao

---

**Version**: 1.1.0 (Dashboard + Supabase Integration)  
**Last Updated**: January 2026
