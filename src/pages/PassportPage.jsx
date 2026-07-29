import React, { useState } from 'react';
import MediQRPassport from '../components/MediQRPassport';
import { useMediQR } from '../context/MediQRContext';
import Modal from '../components/ui/Modal';

const PassportPage = () => {
  const { patientData, mode, prescriptionHistory } = useMediQR();
  const [selectedImage, setSelectedImage] = useState(null);

  if (!patientData) return null;

  const lastName = patientData.name.split(' ').length > 1 ? patientData.name.split(' ').pop() : '';
  const spouseName = lastName ? `John ${lastName}` : 'John Jenkins';

  return (
    <div className="flex flex-col gap-gutter">
      {/* Re-use the main Passport card as the header */}
      <MediQRPassport />
      
      {/* Expanded Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter animate-in fade-in slide-in-from-bottom-4">
        {/* Full Medical History */}
        <section className="glass-panel rounded-xl p-glass-padding">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-2 border-b border-outline-variant/30 pb-2">
            <span className="material-symbols-outlined text-primary">history</span>
            Medical History
          </h2>
          
          <ul className="space-y-4">
            <li className="flex gap-4">
              <div className="w-2 h-2 mt-2 rounded-full bg-primary shrink-0"></div>
              <div>
                <h4 className="font-bold text-body-md text-on-surface">Hypertension Diagnosed</h4>
                <p className="text-sm text-on-surface-variant">March 2023 - Prescribed Lisinopril 10mg</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="w-2 h-2 mt-2 rounded-full bg-secondary shrink-0"></div>
              <div>
                <h4 className="font-bold text-body-md text-on-surface">Annual Checkup</h4>
                <p className="text-sm text-on-surface-variant">November 2025 - All vitals normal.</p>
              </div>
            </li>
            <li className="flex gap-4 opacity-70">
              <div className="w-2 h-2 mt-2 rounded-full bg-outline shrink-0"></div>
              <div>
                <h4 className="font-bold text-body-md text-on-surface">Appendectomy</h4>
                <p className="text-sm text-on-surface-variant">July 2010 - Uncomplicated recovery.</p>
              </div>
            </li>
          </ul>
        </section>

        {/* Emergency Contacts & Expanded Allergies */}
        <section className="flex flex-col gap-gutter">
          <div className="glass-panel rounded-xl p-glass-padding">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-2 border-b border-outline-variant/30 pb-2">
              <span className="material-symbols-outlined text-error">warning</span>
              Allergies & Contraindications
            </h2>
            <div className="flex flex-wrap gap-2">
              <span className="bg-error-container text-on-error-container px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">pill</span>
                {patientData.allergies}
              </span>
              <span className="bg-surface-variant text-on-surface-variant px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">coronavirus</span>
                Dust Mites
              </span>
            </div>
            {mode === 'pharmacist' && (
              <p className="mt-4 text-sm text-on-surface-variant bg-tertiary-container/10 p-3 rounded-lg border-l-2 border-tertiary">
                <strong>Pharmacy Note:</strong> Verify alternative antibiotics if Amoxicillin is prescribed.
              </p>
            )}
          </div>

          <div className="glass-panel rounded-xl p-glass-padding">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-2 border-b border-outline-variant/30 pb-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>contact_phone</span>
              Emergency Contacts
            </h2>
            <div className="flex flex-col gap-3">
              <div className="bg-white/40 dark:bg-white/5 p-3 rounded-lg border border-white/50 dark:border-white/10 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-sm text-on-surface">{spouseName}</h4>
                  <p className="text-xs text-on-surface-variant">Spouse</p>
                </div>
                <span className="font-mono text-primary font-bold text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="bg-white/40 dark:bg-white/5 p-3 rounded-lg border border-white/50 dark:border-white/10 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-sm text-on-surface">Dr. Sarah Miller</h4>
                  <p className="text-xs text-on-surface-variant">Primary Care</p>
                </div>
                <span className="font-mono text-primary font-bold text-sm">+1 (555) 987-6543</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="glass-panel rounded-xl p-glass-padding mt-4 animate-in fade-in slide-in-from-bottom-6">
        <h2 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-2 border-b border-outline-variant/30 pb-2">
          <span className="material-symbols-outlined text-primary">receipt_long</span>
          Prescription History
        </h2>
        
        {prescriptionHistory.length === 0 ? (
          <div className="text-center p-8 bg-surface-container-lowest/50 rounded-xl border border-outline-variant/30">
            <span className="material-symbols-outlined text-4xl text-outline mb-2">inbox</span>
            <p className="text-on-surface-variant text-sm">No prescriptions have been processed yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {prescriptionHistory.map((item, idx) => (
              <div key={idx} className="bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 p-4 rounded-xl shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-outline font-bold tracking-widest uppercase">{new Date(item.date).toLocaleString()}</span>
                    <span className="bg-secondary-container text-on-secondary-container text-[10px] uppercase font-bold px-2 py-1 rounded flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">verified</span>
                      {item.status}
                    </span>
                  </div>
                  <ul className="mt-1">
                    {item.medications.map((m, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm font-bold text-on-surface">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        {m.medicine} <span className="font-normal text-on-surface-variant">({m.dosage} - {m.frequency})</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {item.fileUrl !== "Demo Mode" ? (
                  <button 
                    onClick={() => setSelectedImage(item.fileUrl)}
                    className="shrink-0 text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">visibility</span> View Original Image
                  </button>
                ) : (
                  <span className="shrink-0 text-outline text-sm font-bold px-3 py-1.5">Demo Data (No Image)</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)} title="Original Prescription Image">
        <div className="bg-surface-container-lowest p-2 rounded-lg border border-outline-variant/30 max-h-[70vh] overflow-y-auto flex items-center justify-center">
           {selectedImage && <img src={selectedImage} alt="Prescription Upload" className="max-w-full" />}
        </div>
      </Modal>

    </div>
  );
};

export default PassportPage;
