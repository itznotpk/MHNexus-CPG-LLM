## Changelog

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
