# MHNexus CPG LLM Web Application

A modern, AI-powered Clinical Practice Guideline (CPG) web application prototype built with React, Vite, and Tailwind CSS. This application assists healthcare providers in generating evidence-based care plans using AI recommendations.

![MHNexus CPG LLM](https://img.shields.io/badge/MHNexus-CPG%20LLM-0b5e3c?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=flat-square&logo=tailwind-css)

## 🌟 Features

### Core Workflow (4-Step Process)

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

### Theme: Blue-Teal-Green Gradient
- **Glassmorphism UI**: Modern translucent card design
- **Color Palette**: 
  - Primary: `#d4e6f1` (light) → `#0b5e3c` (dark)
  - Accent: Teal and green gradients
- **Typography**: Slate colors for optimal readability
- **Responsive**: Mobile-first design approach

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
├── App.jsx                 # Main application with routing
├── main.jsx                # React entry point
├── index.css               # Tailwind CSS imports & custom styles
├── components/
│   ├── layout/
│   │   ├── Layout.jsx      # Header & Footer components
│   │   └── index.js
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
│   └── AppContext.jsx      # Global state management
├── data/
│   ├── sampleData.js       # Demo data for testing
│   └── clinicalRulesData.js # CDS rules database
└── utils/
    └── pdfGenerator.js     # PDF export functionality
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
| jspdf-autotable | ^3.8.4 | PDF table formatting |

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

## 🔮 Planned Backend Integration

The UI is prepared for backend connectivity:
- **AI/LLM Integration**: Diagnosis and care plan generation
- **MPIS API**: Real patient data synchronization
- **Analytics API**: Real usage metrics
- **RAG System**: Feedback loop for AI improvement
- **Authentication**: User login and role management
- **Audit Logging**: Complete action tracking

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

**Version**: 1.0.0 (UI Prototype)  
**Last Updated**: January 2026
