// Sample schedule and patient registry data

export const todaySchedule = [
  {
    id: 'apt-001',
    time: '09:00 AM',
    patient: {
      id: 'p-001',
      name: 'Ahmad bin Abdullah',
      age: 68,
      gender: 'Male',
      nsn: 'NSN-2024-78945',
      photo: null
    },
    status: 'waiting', // waiting, in-progress, done
    isEmergency: false,
    isHighRisk: true,
    triage: {
      vitals: {
        bp: '150/90',
        bpStatus: 'high', // normal, high, critical
        hr: 88,
        temp: 37.2,
        spo2: 96
      },
      chiefComplaint: 'Follow-up for Type 2 Diabetes, numbness in feet',
      notes: 'Patient reports increased thirst and frequent urination'
    }
  },
  {
    id: 'apt-002',
    time: '09:30 AM',
    patient: {
      id: 'p-002',
      name: 'Siti Nurhaliza binti Hassan',
      age: 45,
      gender: 'Female',
      nsn: 'NSN-2024-65432',
      photo: null
    },
    status: 'waiting',
    isEmergency: false,
    isHighRisk: false,
    triage: {
      vitals: {
        bp: '120/80',
        bpStatus: 'normal',
        hr: 72,
        temp: 36.8,
        spo2: 98
      },
      chiefComplaint: 'Routine health screening',
      notes: 'Annual check-up, no acute complaints'
    }
  },
  {
    id: 'apt-003',
    time: '10:00 AM',
    patient: {
      id: 'p-003',
      name: 'Raj Kumar a/l Muthu',
      age: 52,
      gender: 'Male',
      nsn: 'NSN-2024-11223',
      photo: null
    },
    status: 'waiting',
    isEmergency: true,
    isHighRisk: true,
    triage: {
      vitals: {
        bp: '180/110',
        bpStatus: 'critical',
        hr: 102,
        temp: 37.0,
        spo2: 94
      },
      chiefComplaint: 'Severe headache, blurred vision',
      notes: 'Hypertensive urgency suspected, known HTN non-compliant with meds'
    }
  },
  {
    id: 'apt-004',
    time: '10:30 AM',
    patient: {
      id: 'p-004',
      name: 'Lee Mei Ling',
      age: 35,
      gender: 'Female',
      nsn: 'NSN-2024-99887',
      photo: null
    },
    status: 'waiting',
    isEmergency: false,
    isHighRisk: false,
    triage: {
      vitals: {
        bp: '118/75',
        bpStatus: 'normal',
        hr: 68,
        temp: 36.5,
        spo2: 99
      },
      chiefComplaint: 'Prenatal check-up (20 weeks)',
      notes: 'Second pregnancy, no complications so far'
    }
  },
  {
    id: 'apt-005',
    time: '11:00 AM',
    patient: {
      id: 'p-005',
      name: 'Mohammad Faiz bin Yusof',
      age: 72,
      gender: 'Male',
      nsn: 'NSN-2024-44556',
      photo: null
    },
    status: 'waiting',
    isEmergency: false,
    isHighRisk: true,
    triage: {
      vitals: {
        bp: '145/88',
        bpStatus: 'high',
        hr: 78,
        temp: 37.1,
        spo2: 95
      },
      chiefComplaint: 'Chest discomfort on exertion',
      notes: 'History of CAD, post-CABG 2019, on dual antiplatelet therapy'
    }
  },
  {
    id: 'apt-006',
    time: '11:30 AM',
    patient: {
      id: 'p-006',
      name: 'Aminah binti Osman',
      age: 58,
      gender: 'Female',
      nsn: 'NSN-2024-77889',
      photo: null
    },
    status: 'waiting',
    isEmergency: false,
    isHighRisk: false,
    triage: {
      vitals: {
        bp: '130/82',
        bpStatus: 'normal',
        hr: 74,
        temp: 36.7,
        spo2: 97
      },
      chiefComplaint: 'Joint pain, difficulty climbing stairs',
      notes: 'Suspected osteoarthritis, BMI 28'
    }
  }
];

export const patientRegistry = [
  {
    id: 'p-001',
    name: 'Ahmad bin Abdullah',
    age: 68,
    gender: 'Male',
    nsn: 'NSN-2024-78945',
    status: 'active', // active, discharged, follow-up
    lastVisit: '2026-01-07',
    nextReview: '2026-01-10',
    tcaDays: 3,
    diagnoses: ['Type 2 Diabetes Mellitus', 'Diabetic Peripheral Neuropathy', 'Hypertension'],
    riskLevel: 'high',
    phone: '+60 12-345 6789',
    email: 'ahmad.abdullah@email.com'
  },
  {
    id: 'p-002',
    name: 'Siti Nurhaliza binti Hassan',
    age: 45,
    gender: 'Female',
    nsn: 'NSN-2024-65432',
    status: 'active',
    lastVisit: '2026-01-07',
    nextReview: null,
    tcaDays: null,
    diagnoses: ['Annual Health Screening'],
    riskLevel: 'low',
    phone: '+60 13-456 7890',
    email: 'siti.nurhaliza@email.com'
  },
  {
    id: 'p-003',
    name: 'Raj Kumar a/l Muthu',
    age: 52,
    gender: 'Male',
    nsn: 'NSN-2024-11223',
    status: 'follow-up',
    lastVisit: '2026-01-07',
    nextReview: '2026-01-08',
    tcaDays: 1,
    diagnoses: ['Hypertensive Urgency', 'Essential Hypertension', 'Medication Non-compliance'],
    riskLevel: 'critical',
    phone: '+60 14-567 8901',
    email: 'raj.kumar@email.com'
  },
  {
    id: 'p-004',
    name: 'Lee Mei Ling',
    age: 35,
    gender: 'Female',
    nsn: 'NSN-2024-99887',
    status: 'active',
    lastVisit: '2026-01-07',
    nextReview: '2026-02-07',
    tcaDays: 31,
    diagnoses: ['Pregnancy (G2P1, 20 weeks)'],
    riskLevel: 'moderate',
    phone: '+60 15-678 9012',
    email: 'mei.ling@email.com'
  },
  {
    id: 'p-005',
    name: 'Mohammad Faiz bin Yusof',
    age: 72,
    gender: 'Male',
    nsn: 'NSN-2024-44556',
    status: 'follow-up',
    lastVisit: '2026-01-07',
    nextReview: '2026-01-14',
    tcaDays: 7,
    diagnoses: ['Coronary Artery Disease', 'Post-CABG', 'Stable Angina'],
    riskLevel: 'high',
    phone: '+60 16-789 0123',
    email: 'faiz.yusof@email.com'
  },
  {
    id: 'p-006',
    name: 'Aminah binti Osman',
    age: 58,
    gender: 'Female',
    nsn: 'NSN-2024-77889',
    status: 'active',
    lastVisit: '2026-01-07',
    nextReview: '2026-01-21',
    tcaDays: 14,
    diagnoses: ['Osteoarthritis', 'Overweight'],
    riskLevel: 'low',
    phone: '+60 17-890 1234',
    email: 'aminah.osman@email.com'
  },
  {
    id: 'p-007',
    name: 'Tan Wei Ming',
    age: 28,
    gender: 'Male',
    nsn: 'NSN-2024-22334',
    status: 'discharged',
    lastVisit: '2025-12-20',
    nextReview: null,
    tcaDays: null,
    diagnoses: ['Acute Upper Respiratory Infection (Resolved)'],
    riskLevel: 'low',
    phone: '+60 18-901 2345',
    email: 'wei.ming@email.com'
  },
  {
    id: 'p-008',
    name: 'Fatimah binti Ismail',
    age: 65,
    gender: 'Female',
    nsn: 'NSN-2024-55667',
    status: 'follow-up',
    lastVisit: '2026-01-05',
    nextReview: '2026-01-12',
    tcaDays: 5,
    diagnoses: ['Chronic Kidney Disease Stage 3', 'Type 2 Diabetes Mellitus'],
    riskLevel: 'high',
    phone: '+60 19-012 3456',
    email: 'fatimah.ismail@email.com'
  }
];

export const dashboardStats = {
  totalAppointments: 6,
  patientsWaiting: 6,
  patientsInProgress: 0,
  patientsDone: 0,
  emergencyCases: 1,
  highRiskCases: 3
};

export const recentActivity = [
  { id: 1, action: 'Care plan generated', patient: 'Tan Wei Ming', time: '2 days ago', type: 'plan' },
  { id: 2, action: 'Follow-up scheduled', patient: 'Fatimah binti Ismail', time: '2 days ago', type: 'schedule' },
  { id: 3, action: 'Lab results reviewed', patient: 'Mohammad Faiz', time: '3 days ago', type: 'lab' },
  { id: 4, action: 'Prescription renewed', patient: 'Ahmad bin Abdullah', time: '1 week ago', type: 'prescription' },
];
