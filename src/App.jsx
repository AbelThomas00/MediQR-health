import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import { useMediQR } from './context/MediQRContext';

// Pages
import DashboardPage from './pages/DashboardPage';
import PassportPage from './pages/PassportPage';
import RxDecodePage from './pages/RxDecodePage';
import SchedulesPage from './pages/SchedulesPage';
import DietPlanPage from './pages/DietPlanPage';

function App() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleTTS = () => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = "Welcome to MediQR Health. Use the top navigation to switch between your Dashboard, Passport, RxDecode Engine, and Schedules.";

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      <Header />
      <main className="flex-grow p-container-padding-mobile md:p-gutter lg:p-container-padding-desktop max-w-7xl mx-auto w-full flex flex-col gap-gutter relative z-0">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/passport" element={<PassportPage />} />
          <Route path="/rxdecode" element={<RxDecodePage />} />
          <Route path="/schedules" element={<SchedulesPage />} />
          <Route path="/diet" element={<DietPlanPage />} />
          <Route path="*" element={
            <div className="flex-grow flex items-center justify-center glass-panel rounded-xl">
              <div className="text-center p-12">
                <span className="material-symbols-outlined text-6xl text-primary/50 mb-4">construction</span>
                <h2 className="text-headline-md font-bold text-on-surface mb-2">Page Not Found</h2>
                <p className="text-on-surface-variant">This section does not exist.</p>
              </div>
            </div>
          } />
        </Routes>
      </main>

      <button 
        aria-label="Speak Instructions" 
        onClick={handleTTS}
        className={`fixed bottom-6 right-6 w-14 h-14 ${isSpeaking ? 'bg-secondary animate-pulse' : 'bg-primary hover:bg-primary/90'} text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-all focus:outline-none focus:ring-4 focus:ring-primary/30 z-40 group`}
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
          {isSpeaking ? 'stop_circle' : 'record_voice_over'}
        </span>
        <span className="absolute right-full mr-4 bg-inverse-surface text-inverse-on-surface px-3 py-1.5 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {isSpeaking ? 'Stop Speaking' : 'Read Page Aloud'}
        </span>
      </button>
    </>
  );
}

export default App;
