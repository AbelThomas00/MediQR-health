import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchPatientData, fetchInitialSchedules } from '../api/mockService';

const MediQRContext = createContext();

export const MediQRProvider = ({ children }) => {
  const [mode, setMode] = useState('patient');
  const [patientData, setPatientData] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [prescriptionHistory, setPrescriptionHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Global UI State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Dashboard stats derived from state
  const dashboardStats = {
    total: schedules.reduce((acc, s) => acc + s.medications.length, 0),
    completed: schedules.filter(s => s.status === 'taken').reduce((acc, s) => acc + s.medications.length, 0),
    pending: schedules.filter(s => s.status === 'pending').reduce((acc, s) => acc + s.medications.length, 0)
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const [patientRes, schedRes] = await Promise.all([
          fetchPatientData(),
          fetchInitialSchedules()
        ]);
        setPatientData(patientRes);
        setSchedules(schedRes);
      } catch (error) {
        console.error("Failed to load initial data", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  const updatePatient = (newData) => {
    setPatientData(prev => ({ ...prev, ...newData }));
  };

  const updateScheduleStatus = (scheduleId, newStatus) => {
    setSchedules(prev => 
      prev.map(sched => sched.id === scheduleId ? { ...sched, status: newStatus } : sched)
    );
  };

  const addDecodedPrescriptionToSchedule = (prescription) => {
    // Basic logic to inject a decoded medication into the schedule
    // For demo purposes, let's append it to the upcoming/pending schedule
    setSchedules(prev => {
      const newSchedules = [...prev];
      // Find evening or afternoon
      const targetIdx = newSchedules.findIndex(s => s.status !== 'taken');
      if (targetIdx !== -1) {
        newSchedules[targetIdx].medications.push({
          id: prescription.id,
          name: prescription.medication,
          dosage: prescription.dosage,
          form: '1 unit',
          type: 'medication'
        });
      }
      return newSchedules;
    });
  };

  const addPrescriptionToHistory = (historyItem) => {
    setPrescriptionHistory(prev => [historyItem, ...prev]);
  };

  return (
    <MediQRContext.Provider value={{
      mode,
      setMode,
      patientData,
      updatePatient,
      schedules,
      updateScheduleStatus,
      addDecodedPrescriptionToSchedule,
      prescriptionHistory,
      addPrescriptionToHistory,
      dashboardStats,
      isLoading,
      isDarkMode,
      toggleDarkMode
    }}>
      {children}
    </MediQRContext.Provider>
  );
};

export const useMediQR = () => useContext(MediQRContext);
