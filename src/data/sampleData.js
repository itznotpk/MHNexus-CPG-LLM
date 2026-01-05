// Sample data for the CPG LLM demo application

export const samplePatientData = {
  name: "Ahmad bin Abdullah",
  dob: "1958-03-15",
  nsn: "580315-08-1234",
  gender: "Male",
  age: 68,
};

export const sampleClinicalNotes = {
  history: `Patient reports persistently high home glucose readings (fasting 12-15, postprandial >15) over 3 months a/w polydipsia and polyuria. Admits non-compliance to meds. Exam: BP 142/86, diminished light touch sensation on bilateral big toes. No wounds.`,
};

export const sampleVitals = {
  bpSystolic: 142,
  bpDiastolic: 86,
  hr: 78,
  temp: 36.6,
  rr: 16,
  spo2: 98,
  weight: 92,
  height: 170,
};

export const sampleMPISData = {
  race: "Malay",
  ethnicity: "Malaysian",
  allergies: "None known",
  comorbidities: ["Type 2 Diabetes Mellitus", "Hypertension", "Hyperlipidemia"],
  currentMeds: [
    { name: "Metformin", dose: "1000mg", frequency: "BD" },
    { name: "Glipizide", dose: "5mg", frequency: "OD" },
    { name: "Amlodipine", dose: "5mg", frequency: "OD" },
    { name: "Atorvastatin", dose: "20mg", frequency: "ON" },
  ],
};

export const sampleDiagnosis = {
  differentials: [
    { id: 1, name: "Type 2 Diabetes Mellitus - Uncontrolled with Peripheral Neuropathy", icdCode: "E11.65", probability: 85, risk: "high" },
    { id: 2, name: "Diabetic Peripheral Neuropathy", icdCode: "E11.42", probability: 70, risk: "medium" },
    { id: 3, name: "Metabolic Syndrome", icdCode: "E88.81", probability: 65, risk: "medium" },
    { id: 4, name: "Chronic Kidney Disease Stage 2-3", icdCode: "N18.3", probability: 25, risk: "medium" },
    { id: 5, name: "Hypertensive Heart Disease", icdCode: "I11.9", probability: 15, risk: "low" },
  ],
  selectedDiagnosisId: 1,
};

export const sampleCarePlan = {
  clinicalSummary: `68-year-old Malay male with poorly controlled Type 2 Diabetes Mellitus (suspected HbA1c >9%), presenting with classic hyperglycemic symptoms (polydipsia, polyuria) and evidence of early peripheral neuropathy. Current glycemic control inadequate on Metformin and Glipizide. Cardiovascular risk factors include hypertension (BP 142/86) and obesity (BMI 31.8). Requires medication optimization and intensification of diabetes management.`,
  
  interventions: [
    {
      id: 1,
      name: "Dilated Retinal Examination",
      code: "ICHI: PZX.DB.AC",
      rationale: "Annual screening for diabetic retinopathy - overdue",
      urgency: "Within 2 weeks",
      accepted: true,
    },
    {
      id: 2,
      name: "Comprehensive Foot Examination",
      code: "ICHI: PZX.BD.AE",
      rationale: "Evidence of peripheral neuropathy on exam",
      urgency: "Today",
      accepted: true,
    },
    {
      id: 3,
      name: "Diabetes Self-Management Education",
      code: "ICHI: PZX.HA.ZZ",
      rationale: "Non-compliance reported, reinforce education",
      urgency: "This visit",
      accepted: true,
    },
  ],

  medications: {
    stop: [
      {
        id: 1,
        name: "Glipizide",
        dose: "5mg OD",
        reason: "Replacing with SGLT2i for better cardiovascular and renal protection",
        accepted: true,
      },
    ],
    start: [
      {
        id: 2,
        name: "Empagliflozin",
        dose: "10mg OD",
        reason: "SGLT2 inhibitor - provides glycemic control with cardiovascular and renal benefits",
        instructions: "Take in the morning. Review sick day rules.",
        accepted: true,
      },
      {
        id: 3,
        name: "Lisinopril",
        dose: "5mg OD",
        reason: "ACE inhibitor for renal protection and improved BP control",
        instructions: "Monitor potassium and creatinine in 2 weeks",
        accepted: true,
      },
    ],
    continue: [
      {
        id: 4,
        name: "Metformin",
        dose: "1000mg BD",
        reason: "First-line agent, well tolerated",
        accepted: true,
      },
      {
        id: 5,
        name: "Amlodipine",
        dose: "5mg OD",
        reason: "Ongoing BP management",
        accepted: true,
      },
      {
        id: 6,
        name: "Atorvastatin",
        dose: "20mg ON",
        reason: "Lipid management - consider uptitration",
        accepted: true,
      },
    ],
  },

  monitoring: [
    { id: 1, task: "Daily home blood glucose monitoring (fasting + post-prandial)", accepted: true },
    { id: 2, task: "Weekly weight monitoring", accepted: true },
    { id: 3, task: "Daily foot inspection for wounds or changes", accepted: true },
    { id: 4, task: "Monitor for signs of UTI/genital infection (SGLT2i side effect)", accepted: true },
    { id: 5, task: "Home BP monitoring twice daily", accepted: true },
  ],

  investigations: [
    { id: 1, name: "HbA1c", code: "LOINC: 4548-4", priority: "Urgent", accepted: true },
    { id: 2, name: "Fasting Lipid Profile", code: "LOINC: 57698-3", priority: "Routine", accepted: true },
    { id: 3, name: "Urine Microalbumin/Creatinine Ratio", code: "LOINC: 14959-1", priority: "Urgent", accepted: true },
    { id: 4, name: "Renal Function Panel (eGFR, Cr, K+)", code: "LOINC: 24362-6", priority: "Urgent", accepted: true },
    { id: 5, name: "Liver Function Test", code: "LOINC: 24325-3", priority: "Routine", accepted: true },
  ],

  disposition: {
    followUp: "4 weeks",
    referrals: [
      { specialty: "Ophthalmology", reason: "Diabetic retinopathy screening", urgency: "2 weeks" },
      { specialty: "Dietitian", reason: "Medical nutrition therapy for diabetes and weight management", urgency: "2 weeks" },
    ],
    patientEducation: [
      "SGLT2 inhibitor sick day rules - stop medication during acute illness, dehydration, or fasting",
      "Hypoglycemia recognition and management",
      "Importance of medication compliance",
      "Foot care and daily inspection",
      "Signs of diabetic ketoacidosis (rare but important with SGLT2i)",
    ],
  },

  cpgReferences: [
    { title: "MoH CPG Management of Type 2 Diabetes Mellitus", edition: "6th Edition", page: "25-28", year: "2020" },
    { title: "MoH CPG Management of Hypertension", edition: "5th Edition", page: "42", year: "2018" },
    { title: "ADA Standards of Medical Care in Diabetes", edition: "2024", page: "S140-S156", year: "2024" },
    { title: "KDIGO Clinical Practice Guideline for Diabetes in CKD", edition: "2022", page: "18-22", year: "2022" },
  ],
};
