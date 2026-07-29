import React, { useState } from 'react';
import RxDecodeEngine from '../components/RxDecodeEngine';
import { useMediQR } from '../context/MediQRContext';
import Modal from '../components/ui/Modal';

const RxDecodePage = () => {
  const { mode } = useMediQR();
  
  const [history] = useState([
    { id: 'rx-001', date: '2026-07-28', status: 'Verified', medication: 'Amoxicillin 500mg', imageUrl: 'https://placehold.co/600x800/f8f9ff/0b1c30?text=Scanned+Prescription%5CnAmoxicillin+500mg%5CnTake+1+pill+daily' },
    { id: 'rx-002', date: '2026-07-25', status: 'Pending Review', medication: 'Lisinopril 10mg', imageUrl: 'https://placehold.co/600x800/f8f9ff/0b1c30?text=Scanned+Prescription%5CnLisinopril+10mg%5CnTake+with+water' },
    { id: 'rx-003', date: '2026-07-10', status: 'Verified', medication: 'Metformin 850mg', imageUrl: 'https://placehold.co/600x800/f8f9ff/0b1c30?text=Scanned+Prescription%5CnMetformin+850mg%5CnTake+after+meal' },
  ]);

  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="flex flex-col gap-gutter">
      <div className="max-w-3xl mx-auto w-full">
        {/* Re-use the main Engine component, but centered and prominent */}
        <RxDecodeEngine />
      </div>

      <section className="glass-panel rounded-xl p-glass-padding mt-4 animate-in fade-in slide-in-from-bottom-4">
        <h2 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-2 border-b border-outline-variant/30 pb-2">
          <span className="material-symbols-outlined text-primary">history</span>
          Prescription History
        </h2>
        
        <div className="border border-outline-variant/40 rounded-lg overflow-hidden w-full overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[500px]">
            <thead className="bg-surface-container-low text-on-surface-variant">
              <tr>
                <th className="p-3 font-label-caps">Date</th>
                <th className="p-3 font-label-caps">Medication Extracted</th>
                <th className="p-3 font-label-caps">Status</th>
                <th className="p-3 font-label-caps text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 bg-white/50 dark:bg-white/5">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-white/80 dark:hover:bg-white/10 transition-colors">
                  <td className="p-3 text-on-surface-variant">{item.date}</td>
                  <td className="p-3 font-bold text-on-surface">{item.medication}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      item.status === 'Verified' ? 'bg-secondary/10 text-secondary' : 'bg-tertiary/10 text-tertiary'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button 
                      onClick={() => setSelectedImage(item.imageUrl)} 
                      className="text-primary font-bold hover:underline"
                    >
                      View Original
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* View Original Prescription Modal */}
      <Modal 
        isOpen={!!selectedImage} 
        onClose={() => setSelectedImage(null)} 
        title="Original Prescription"
      >
        <div className="flex flex-col items-center">
          {selectedImage && (
             <div className="bg-surface-container-highest/50 dark:bg-surface-container-lowest/50 p-2 rounded-xl border border-outline-variant/30 overflow-hidden w-full max-h-[60vh] flex items-center justify-center">
                <img 
                  src={selectedImage} 
                  alt="Original Prescription" 
                  className="max-w-full max-h-[55vh] object-contain rounded-lg shadow-sm"
                />
             </div>
          )}
          <div className="mt-6 flex justify-end w-full">
            <button 
              className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RxDecodePage;
