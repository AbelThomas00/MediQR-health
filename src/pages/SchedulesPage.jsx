import React, { useState } from 'react';
import PerspectiveEngine from '../components/PerspectiveEngine';
import { useMediQR } from '../context/MediQRContext';

const SchedulesPage = () => {
  const { mode } = useMediQR();
  const [selectedDay, setSelectedDay] = useState(3); // Mock selecting "Today"

  // Mock week days
  const weekDays = [
    { day: 'Mon', date: '24', active: false },
    { day: 'Tue', date: '25', active: false },
    { day: 'Wed', date: '26', active: false },
    { day: 'Thu', date: '27', active: true }, // Today
    { day: 'Fri', date: '28', active: false },
    { day: 'Sat', date: '29', active: false },
    { day: 'Sun', date: '30', active: false },
  ];

  return (
    <div className="flex flex-col gap-gutter">
      {/* Interactive Calendar Strip for Patient Mode */}
      {mode === 'patient' && (
        <section className="glass-panel rounded-xl p-4 flex justify-between items-center overflow-x-auto gap-4">
          {weekDays.map((d, i) => (
            <button 
              key={i}
              onClick={() => setSelectedDay(i)}
              className={`flex flex-col items-center justify-center p-3 rounded-lg min-w-[60px] transition-all ${
                selectedDay === i 
                  ? 'bg-primary text-white shadow-md scale-105' 
                  : 'bg-white/50 text-on-surface hover:bg-white/80'
              }`}
            >
              <span className={`text-xs font-bold ${selectedDay === i ? 'text-primary-fixed' : 'text-outline'}`}>{d.day}</span>
              <span className="text-lg font-bold">{d.date}</span>
              {d.active && <div className={`w-1.5 h-1.5 rounded-full mt-1 ${selectedDay === i ? 'bg-white' : 'bg-primary'}`}></div>}
            </button>
          ))}
        </section>
      )}

      {/* Main Schedule Engine */}
      <div className="animate-in fade-in slide-in-from-bottom-4">
        <PerspectiveEngine />
      </div>

      {/* Analytics for Pharmacy Mode */}
      {mode === 'pharmacist' && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter animate-in fade-in">
          <div className="glass-panel rounded-xl p-glass-padding text-center">
            <span className="material-symbols-outlined text-4xl text-primary mb-2">inventory_2</span>
            <h3 className="text-headline-md font-bold text-on-surface">142</h3>
            <p className="text-sm text-on-surface-variant">Pending Dispensations</p>
          </div>
          <div className="glass-panel rounded-xl p-glass-padding text-center">
            <span className="material-symbols-outlined text-4xl text-secondary mb-2">verified</span>
            <h3 className="text-headline-md font-bold text-on-surface">89</h3>
            <p className="text-sm text-on-surface-variant">Completed Today</p>
          </div>
          <div className="glass-panel rounded-xl p-glass-padding text-center">
            <span className="material-symbols-outlined text-4xl text-tertiary mb-2">warning</span>
            <h3 className="text-headline-md font-bold text-on-surface">3</h3>
            <p className="text-sm text-on-surface-variant">Interaction Alerts</p>
          </div>
        </section>
      )}
    </div>
  );
};

export default SchedulesPage;
