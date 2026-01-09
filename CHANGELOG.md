## Changelog

### 2026-01-09 (Session 2)

#### My Patients Tab Improvements
- **Medical History Button Theming**: The "Medical History" button now follows the accent color selected in Settings, displayed as a solid light version of the chosen accent color.
- **Simplified Patient Table**: Removed age, gender, and NRIC columns from the main table view for a cleaner display. These details are still shown when expanding a patient row.
- **Center-Aligned Table**: All column headers are now center-aligned. Status, Next Review, Risk, and Actions columns content are also center-aligned for better visual consistency.
- **NRIC Font Consistency**: NRIC now uses the same font style as other table content (removed monospace font).

#### Profile & Settings Enhancements
- **Synchronized Profile Avatar**: Profile picture in Settings now matches the sidebar profile - uses the same initials and accent color gradient.

#### Consultation Workflow Improvements
- **Auto-Fill NRIC from Home Page**: When clicking "Start Consult" for a patient on the Home page, the NRIC is now automatically pre-filled in the Consultation tab's search field.
- **Clean State for Manual Consultation**: When manually navigating to Consultation via sidebar, the NRIC field starts blank for a fresh consultation.

#### Theme System Enhancements
- **Extended Accent Color Properties**: Added light background variants (`lightBg`, `lightBgHover`, `lightBgDark`, `lightBgDarkHover`, `lightBorder`, `lightBorderDark`, `textLight`) to all accent colors for more styling flexibility.

### 2026-01-09

#### Patient Management & UI Enhancements
- **Colorful Patient Avatars**: Added initial-based, color-coded avatars for patients in Home and My Patients sections to improve visual identification.
- **My Patients Table Refactor**: 
  - Patient details now expand directly below the clicked row for better contextual navigation.
  - Added "View Chart" buttons directly in the patient rows.
  - Consistent accent color application across table buttons.
- **Home Dashboard Improvements**:
  - Restructured Today's Schedule layout: Chief complaint now appears below the patient name.
  - Action buttons (Quick View, Start Consult) moved to a vertical rectangular block on the right.
  - Profile pictures (avatars) aligned beside the patient name row.

#### Clinical & Consultation Features
- **NRIC Format Validation**: Implemented robust regex validation (`xxxxxx-xx-xxxx`) and helpful error messaging for patient search.
- **Consultation View Chart Modal**: Integrated a non-disruptive modal for viewing vital signs charts directly from the patient information card.
- **Clinical Notes Confirmation**: Added a "Confirm" step for clinical notes to ensure review before proceeding to AI analysis.
- **Medical History System**:
  - Added comprehensive historical medical data (Conditions, Medications, Lab Results, Procedures, Allergies).
  - New "Medical History" modal in My Patients to view this data in organized tables with status badges.

#### User Profile & System
- **Profile Edit Mode**: Added toggleable edit mode in Settings with save/cancel functionality and success notifications.
- **Dynamic Sidebar Profile**: The sidebar now automatically reflects the doctor's name, specialty, and initials from the updated profile settings.
- **Shared State Management**: Synchronized profile and chart states across the application.

### 2026-01-08

#### UI/UX Improvements
- Removed "Evidence-based recommendations" text from below the "Recommended Care Plan" title for a cleaner UI.
- Moved the "Read Summary" button next to the clinical summary for better accessibility.
- Updated the sidebar: Renamed "Add Patient" to "Consultation" and changed the icon to a stethoscope for clarity.
- Simplified the approval workflow:
  - Now a two-step process: Approve or Reject (with comment).
  - On reject, user can add feedback and immediately regenerate the care plan in-place.
  - Approval required before generating the final report.
- Removed confidence percentages from diagnosis differentials for a less cluttered diagnosis section.
- Updated button labels and placements for clarity (e.g., "Regenerate Care Plan" now only appears in context, not as a top-level action).
- Improved feedback/comment UI in the approval workflow, with clearer prompts and error states.
- Cleaned up code and removed unused workflow progress components.

#### Codebase/Component Changes
- `CarePlanSection.jsx`: Major UI/UX refactor, removed evidence text, improved summary and regenerate logic.
- `ApprovalWorkflow.jsx`: Refactored to a simple approve/reject model, added in-place regenerate on reject, removed multi-stage progress.
- `Sidebar.jsx`: Updated consultation tab label and icon.
- `DiagnosisSection.jsx`: Removed confidence %, updated button labels.
- `shared/index.js`: Cleaned up exports to match refactored components.

---

For details, see the commit: 3d348d9 (2026-01-08)
