import React, { useState } from 'react';
import { useMediQR } from '../context/MediQRContext';
import Modal from './ui/Modal';
import CameraModal from './ui/CameraModal';
import { updatePatientData, fetchPatientByKey } from '../api/mockService';
import { QRCodeSVG } from 'qrcode.react';
import jsQR from 'jsqr';

const MediQRPassport = () => {
  const { patientData, updatePatient, mode } = useMediQR();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [manualKey, setManualKey] = useState('');
  const [manualError, setManualError] = useState('');
  const [isFetchingManual, setIsFetchingManual] = useState(false);

  const handleScanComplete = async (scannedKey) => {
    try {
      const patient = await fetchPatientByKey(scannedKey);
      updatePatient(patient);
    } catch (err) {
      alert(err.message || "Invalid QR Code Scanned.");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code) {
          handleScanComplete(code.data);
        } else {
          alert("Could not find a valid QR Code in the uploaded image.");
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = null; // reset input
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualKey.trim()) return;
    
    setIsFetchingManual(true);
    setManualError('');
    try {
      const patient = await fetchPatientByKey(manualKey.trim());
      updatePatient(patient);
      setManualKey('');
    } catch (err) {
      setManualError(err.message);
    } finally {
      setIsFetchingManual(false);
    }
  };

  const handleEditClick = () => {
    setFormData(patientData);
    setError(null);
    setIsEditModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      const updated = await updatePatientData(formData);
      updatePatient(updated);
      setIsEditModalOpen(false);
    } catch (err) {
      setError(err.message || 'Failed to update patient data.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!patientData) return null;

  return (
    <section className="glass-panel rounded-xl p-glass-padding flex flex-col gap-6 relative overflow-hidden group">
      {/* Decorative background blur */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-fixed-dim/30 rounded-full blur-3xl -z-10 group-hover:bg-primary-fixed/40 transition-colors duration-700"></div>
      
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">qr_code_scanner</span>
            MediQR Passport
          </h2>
          <p className="text-on-surface-variant text-body-md">Your unified digital health identity.</p>
        </div>
        <div className="flex items-center gap-2">
          {mode === 'patient' && (
            <button 
              onClick={handleEditClick}
              className="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-full hover:bg-primary/10 flex items-center justify-center"
              title="Edit Profile"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
          )}
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-label-caps text-label-caps border border-primary/20 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">verified_user</span> {patientData.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
        {/* Profile Info */}
        <div className="md:col-span-3 flex flex-col gap-4">
          <div className="bg-gradient-to-br from-white/60 to-white/30 dark:from-white/10 dark:to-white/5 p-5 rounded-xl border border-white/50 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-headline-md shrink-0">
                {patientData.initials}
              </div>
              <div>
                <h3 className="font-bold text-body-lg text-on-surface">{patientData.name}</h3>
                <p className="text-on-surface-variant text-sm">DOB: {patientData.dob}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="glass-input p-2 rounded-md">
                <span className="text-xs text-outline block mb-0.5 font-label-caps">Blood Type</span>
                <span className="font-bold text-on-surface flex items-center gap-1">
                  <span className="material-symbols-outlined text-tertiary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
                  {patientData.bloodType}
                </span>
              </div>
              <div className="glass-input p-2 rounded-md">
                <span className="text-xs text-outline block mb-0.5 font-label-caps">Allergies</span>
                <span className="font-bold text-on-surface flex items-center gap-1">
                  <span className="material-symbols-outlined text-error text-sm">warning</span>
                  {Array.isArray(patientData.allergies) ? patientData.allergies.join(', ') : patientData.allergies}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between bg-surface-container-highest/50 p-3 rounded-lg border border-white/50">
            <div>
              <span className="text-xs text-outline block font-label-caps">Global Access Key</span>
              <span className="font-mono font-bold text-primary tracking-widest">{patientData.id}</span>
            </div>
            <button className="text-primary hover:bg-primary/10 p-1.5 rounded-md transition-colors" title="Copy Key" onClick={() => navigator.clipboard.writeText(patientData.id)}>
              <span className="material-symbols-outlined text-sm">content_copy</span>
            </button>
          </div>
        </div>

        {/* QR Code Area */}
        <div className="md:col-span-2 flex flex-col items-center justify-center gap-4 w-full">
          <div className="bg-white p-4 rounded-2xl shadow-[0_0_40px_rgba(0,89,187,0.15)] border border-white/80 relative flex items-center justify-center group-hover:shadow-[0_0_50px_rgba(0,89,187,0.25)] transition-all duration-500">
            <QRCodeSVG 
              value={patientData.id} 
              size={128} 
              bgColor={"#ffffff"}
              fgColor={"#0b1c30"}
              level={"H"}
            />
            <div className="absolute inset-x-3 top-3 h-0.5 bg-secondary-fixed shadow-[0_0_8px_2px_rgba(111,251,190,0.5)] z-10 animate-[scan_2s_ease-in-out_infinite]"></div>
          </div>
          
          <div className="w-full flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <button 
                className="flex-1 bg-primary text-white font-body-md font-bold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-2"
                onClick={() => setIsCameraOpen(true)}
              >
                <span className="material-symbols-outlined">qr_code_scanner</span>
                Camera Scan
              </button>
              
              <label className="flex-1 bg-surface-variant text-on-surface-variant font-body-md font-bold py-2 px-4 rounded-lg hover:bg-surface-variant/80 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer text-center">
                <span className="material-symbols-outlined">upload_file</span>
                Upload QR
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload} 
                />
              </label>
            </div>

            {mode === 'pharmacist' && (
              <form onSubmit={handleManualSubmit} className="flex flex-col gap-1 w-full mt-2">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter Access Key..."
                    className="glass-input flex-1 p-2 rounded-lg text-sm text-on-surface focus:ring-1 focus:ring-primary font-mono uppercase"
                    value={manualKey}
                    onChange={(e) => setManualKey(e.target.value)}
                  />
                  <button 
                    type="submit"
                    disabled={isFetchingManual}
                    className="bg-surface-variant text-on-surface-variant px-3 rounded-lg font-bold hover:bg-surface-variant/80 transition-colors flex items-center justify-center"
                  >
                    {isFetchingManual ? <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> : 'Fetch'}
                  </button>
                </div>
                {manualError && <p className="text-error text-[10px] ml-1">{manualError}</p>}
              </form>
            )}
          </div>
        </div>
      </div>
      
      <CameraModal 
        isOpen={isCameraOpen} 
        onClose={() => setIsCameraOpen(false)} 
        onScanComplete={handleScanComplete}
      />

      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        title="Edit Patient Information"
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          {error && (
            <div className="bg-error-container text-on-error-container p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label className="text-xs text-outline font-label-caps mb-1 block">Full Name</label>
            <input 
              type="text" 
              className="glass-input w-full p-2.5 rounded-lg text-body-md text-on-surface focus:ring-primary focus:border-primary transition-all"
              value={formData.name || ''}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-outline font-label-caps mb-1 block">Date of Birth</label>
              <input 
                type="text" 
                className="glass-input w-full p-2.5 rounded-lg text-body-md text-on-surface focus:ring-primary focus:border-primary transition-all"
                value={formData.dob || ''}
                onChange={(e) => setFormData({...formData, dob: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="text-xs text-outline font-label-caps mb-1 block">Global Access Key</label>
              <input 
                type="text" 
                className="glass-input w-full p-2.5 rounded-lg text-body-md text-on-surface focus:ring-primary focus:border-primary transition-all font-mono"
                value={formData.id || ''}
                onChange={(e) => setFormData({...formData, id: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-outline font-label-caps mb-1 block">Blood Type</label>
              <input 
                type="text" 
                className="glass-input w-full p-2.5 rounded-lg text-body-md text-on-surface focus:ring-primary focus:border-primary transition-all"
                value={formData.bloodType || ''}
                onChange={(e) => setFormData({...formData, bloodType: e.target.value})}
              />
            </div>
            <div>
              <label className="text-xs text-outline font-label-caps mb-1 block">Allergies</label>
              <input 
                type="text" 
                className="glass-input w-full p-2.5 rounded-lg text-body-md text-on-surface focus:ring-primary focus:border-primary transition-all"
                value={formData.allergies || ''}
                onChange={(e) => setFormData({...formData, allergies: e.target.value})}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-2 pt-4 border-t border-outline-variant/30">
            <button 
              type="button" 
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-on-surface-variant font-bold hover:bg-surface-variant rounded-lg transition-colors"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-primary text-white font-bold rounded-lg shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  Saving...
                </>
              ) : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
};

export default MediQRPassport;
