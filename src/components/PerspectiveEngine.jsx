import React, { useState } from 'react';
import { useMediQR } from '../context/MediQRContext';
import { markScheduleTaken } from '../api/mockService';

const PerspectiveEngine = () => {
  const { mode, schedules, updateScheduleStatus, dashboardStats } = useMediQR();
  const [loadingIds, setLoadingIds] = useState(new Set());
  
  const isPatient = mode === 'patient';

  const handleMarkTaken = async (scheduleId) => {
    setLoadingIds(prev => new Set(prev).add(scheduleId));
    try {
      const res = await markScheduleTaken(scheduleId);
      if (res.success) {
        updateScheduleStatus(scheduleId, 'taken');
      }
    } catch (error) {
      alert("Failed to update schedule");
    } finally {
      setLoadingIds(prev => {
        const next = new Set(prev);
        next.delete(scheduleId);
        return next;
      });
    }
  };

  return (
    <section className="glass-panel rounded-xl p-glass-padding flex flex-col gap-6 relative min-h-[300px]">
      <div className="flex justify-between items-end border-b border-outline-variant/30 pb-4 flex-wrap gap-4">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-1 flex items-center gap-2" id="perspective-title">
            <span className="material-symbols-outlined text-primary" id="perspective-icon">
              {isPatient ? 'calendar_month' : 'fact_check'}
            </span>
            <span id="perspective-heading">
              {isPatient ? 'Daily Pill Schedule' : 'Dispensing Checklist'}
            </span>
          </h2>
          <p className="text-on-surface-variant text-body-md" id="perspective-subheading">
            {isPatient ? 'Your personalized medication timeline for today.' : 'Review and verify prescriptions before sign-off.'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Dashboard Stats */}
          {isPatient && (
            <div className="flex gap-3 text-sm bg-surface-variant/50 p-2 rounded-lg border border-outline-variant/30">
              <div className="flex flex-col items-center px-2 border-r border-outline-variant/30">
                <span className="text-on-surface-variant text-xs uppercase tracking-wider font-bold">Total</span>
                <span className="text-primary font-bold">{dashboardStats.total}</span>
              </div>
              <div className="flex flex-col items-center px-2 border-r border-outline-variant/30">
                <span className="text-on-surface-variant text-xs uppercase tracking-wider font-bold">Taken</span>
                <span className="text-secondary font-bold">{dashboardStats.completed}</span>
              </div>
              <div className="flex flex-col items-center px-2">
                <span className="text-on-surface-variant text-xs uppercase tracking-wider font-bold">Pending</span>
                <span className="text-tertiary font-bold">{dashboardStats.pending}</span>
              </div>
            </div>
          )}

          <div 
            className={isPatient ? "text-sm font-bold text-primary bg-primary-container/20 px-3 py-1 rounded-full whitespace-nowrap" : "text-sm font-bold text-on-secondary-container bg-secondary-container/40 border border-secondary/20 px-3 py-1 rounded-full whitespace-nowrap"} 
            id="perspective-badge"
          >
            {isPatient ? 'Patient View Active' : 'Pharmacy Mode Active'}
          </div>
        </div>
      </div>
      
      {/* Content Area: Swaps based on mode */}
      {isPatient ? (
        <div className="relative pl-4 block" id="content-patient">
          {schedules.map((schedule, index) => {
            const isTaken = schedule.status === 'taken';
            const isPending = schedule.status === 'pending';
            const isUpcoming = schedule.status === 'upcoming';
            const isLoading = loadingIds.has(schedule.id);
            const isLast = index === schedules.length - 1;

            return (
              <div key={schedule.id} className={`relative pl-8 ${isLast ? '' : 'pb-8'} timeline-item`}>
                <div className="timeline-line"></div>
                
                {/* Timeline Node */}
                {isTaken && (
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-secondary-container border-2 border-white shadow-sm flex items-center justify-center z-10 transition-colors">
                    <span className="material-symbols-outlined text-[14px] text-on-secondary-container">check</span>
                  </div>
                )}
                {isPending && (
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary border-2 border-white shadow-sm flex items-center justify-center z-10 animate-pulse transition-colors">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                  </div>
                )}
                {isUpcoming && (
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-surface-variant border-2 border-white shadow-sm flex items-center justify-center z-10 transition-colors">
                  </div>
                )}

                <div className={`flex justify-between items-start ${isUpcoming ? 'opacity-60' : ''} transition-opacity`}>
                  <div>
                    <h4 className="font-bold text-body-lg text-on-surface flex items-center gap-2">
                      {schedule.routine}
                      <span className={`text-xs font-normal px-2 py-0.5 rounded ${isPending ? 'text-primary bg-primary-container/20' : 'text-on-surface-variant bg-surface-variant'}`}>
                        {schedule.time} {isPending ? '(Now)' : ''}
                      </span>
                    </h4>
                    {schedule.instructions && <p className="text-sm text-on-surface-variant mt-1">{schedule.instructions}</p>}
                  </div>
                  
                  {isTaken && <span className="bg-secondary/10 text-secondary px-2 py-1 rounded text-xs font-bold animate-in zoom-in">Taken</span>}
                  {isUpcoming && <span className="text-outline text-xs font-bold uppercase tracking-wider">Upcoming</span>}
                  {isPending && (
                    <button 
                      onClick={() => handleMarkTaken(schedule.id)}
                      disabled={isLoading}
                      className="bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-1 disabled:opacity-70"
                    >
                      {isLoading ? (
                        <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                      ) : null}
                      {isLoading ? 'Updating' : 'Mark Taken'}
                    </button>
                  )}
                </div>
                
                {/* Medications List */}
                {schedule.medications.length > 0 && (
                  <div className={`mt-3 flex flex-col gap-2 ${isUpcoming ? 'opacity-60' : ''}`}>
                    {schedule.medications.map(med => (
                      <div key={med.id} className={`bg-white/80 ${isPending ? 'border-2 border-primary/20 shadow-sm' : 'border border-white'} p-3 rounded-lg flex items-center gap-4 transition-all hover:bg-white`}>
                        <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-primary" style={med.type === 'pill' ? { fontVariationSettings: "'FILL' 1" } : {}}>
                            {med.type === 'pill' ? 'pill' : 'medication'}
                          </span>
                        </div>
                        <div className="flex-grow">
                          <span className="font-bold block text-sm">{med.name}</span>
                          <span className="text-xs text-outline">{med.dosage} • {med.form}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200" id="content-pharmacist">
          <div className="bg-tertiary-container/10 border-l-4 border-tertiary p-4 rounded-r-lg mb-2">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-tertiary mt-0.5">info</span>
              <div>
                <h5 className="font-bold text-on-surface">Interaction Alert</h5>
                <p className="text-sm text-on-surface-variant mt-1">Patient allergy profile flags potential issue with prescribed Amoxicillin. Verification required.</p>
              </div>
            </div>
          </div>
          <div className="border border-outline-variant/40 rounded-lg overflow-hidden w-full overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[500px]">
              <thead className="bg-surface-container-low text-on-surface-variant">
                <tr>
                  <th className="p-3 font-label-caps">Medication</th>
                  <th className="p-3 font-label-caps">Instructions</th>
                  <th className="p-3 font-label-caps">Stock</th>
                  <th className="p-3 font-label-caps text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 bg-white/50">
                {schedules.flatMap(s => s.medications).map((med, i) => (
                  <tr key={med.id || i}>
                    <td className="p-3 font-bold text-on-surface">{med.name} {med.dosage}</td>
                    <td className="p-3 text-on-surface-variant">{med.form}</td>
                    <td className="p-3"><span className="text-secondary font-bold">In Stock</span></td>
                    <td className="p-3 text-right">
                      {med.name === 'Amoxicillin' ? (
                        <button className="text-tertiary font-bold hover:underline">Review Override</button>
                      ) : (
                        <button className="bg-primary/10 text-primary px-3 py-1 rounded font-bold hover:bg-primary/20 transition-colors">Prepare</button>
                      )}
                    </td>
                  </tr>
                ))}
                {schedules.flatMap(s => s.medications).length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-on-surface-variant">No medications scheduled.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end gap-3 border-t border-outline-variant/30 pt-4">
            <button className="px-4 py-2 text-on-surface-variant font-bold hover:bg-surface-variant rounded-lg transition-colors">Cancel</button>
            <button className="px-4 py-2 bg-primary text-white font-bold rounded-lg shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2 opacity-50 cursor-not-allowed" disabled>
              <span className="material-symbols-outlined text-[18px]">verified</span>
              Digital Sign-off
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default PerspectiveEngine;
