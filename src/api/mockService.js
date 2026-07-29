// Mock API Service Layer for MediQR
// This abstracts all backend communications to allow easy swap to real endpoints later.

const MOCK_DELAY = 1200; // Simulate network latency

export const mockPatients = [
  { id: 'MED-1234-A', name: 'James Wilson', dob: '15 Mar 1975', bloodType: 'B-Positive', allergies: ['None'], conditions: [], initials: 'JW', status: 'Verified' },
  { id: 'MED-1234-B', name: 'Sarah Miller', dob: '22 Nov 1990', bloodType: 'A-Negative', allergies: ['Latex'], conditions: ['Asthma'], initials: 'SM', status: 'Verified' },
  { id: 'MED-1234-C', name: 'David Chen', dob: '08 Jul 1982', bloodType: 'O-Positive', allergies: ['Peanuts'], conditions: [], initials: 'DC', status: 'Pending' },
  { id: 'MED-1234-D', name: 'Emily Davis', dob: '30 Jan 1995', bloodType: 'AB-Positive', allergies: ['Sulfa Drugs'], conditions: [], initials: 'ED', status: 'Verified' },
  { id: 'MED-7842-X', name: 'Elenor Jenkins', dob: '12 Oct 1985', bloodType: 'O-Negative', allergies: ['Penicillin', 'Peanuts'], conditions: ['Hypertension', 'Type 2 Diabetes'], initials: 'EJ', status: 'Verified' }
];

export const fetchPatientData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPatients[mockPatients.length - 1]); // Elenor Jenkins by default
    }, 500);
  });
};

export const fetchPatientByKey = async (key) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const patient = mockPatients.find(p => p.id === key);
      if (patient) {
        resolve(patient);
      } else {
        reject(new Error("No patient found with that Global Access Key."));
      }
    }, 800);
  });
};

export const updatePatientData = async (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!data.name || !data.dob) {
        reject(new Error("Name and DOB are required."));
      } else {
        const nameParts = data.name.trim().split(' ');
        let initials = data.initials;
        if (nameParts.length >= 2) {
          initials = (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
        } else if (nameParts.length === 1 && nameParts[0].length > 0) {
          initials = nameParts[0][0].toUpperCase();
        }
        resolve({ ...data, initials });
      }
    }, MOCK_DELAY);
  });
};


export const fetchInitialSchedules = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'sched-1',
          time: '08:00 AM',
          routine: 'Morning Routine',
          instructions: 'Take with breakfast',
          medications: [
            { id: 'med-1', name: 'Lisinopril', dosage: '10mg', form: '1 tablet', type: 'pill' }
          ],
          status: 'taken'
        },
        {
          id: 'sched-2',
          time: '01:00 PM',
          routine: 'Afternoon Dose',
          instructions: 'Take after lunch',
          medications: [
            { id: 'med-2', name: 'Metformin', dosage: '850mg', form: '1 tablet', type: 'medication' }
          ],
          status: 'pending' // For demonstration
        },
        {
          id: 'sched-3',
          time: '08:00 PM',
          routine: 'Evening Routine',
          instructions: 'Take before bed',
          medications: [],
          status: 'upcoming'
        }
      ]);
    }, 500);
  });
};

export const markScheduleTaken = async (scheduleId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, scheduleId, timestamp: new Date().toISOString() });
    }, 800);
  });
};
