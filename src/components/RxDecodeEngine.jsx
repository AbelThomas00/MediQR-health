import React, { useState, useRef } from 'react';
import { useMediQR } from '../context/MediQRContext';
import { decodePrescription } from '../api/prescriptionService';

const RxDecodeEngine = () => {
  const { addDecodedPrescriptionToSchedule, addPrescriptionToHistory } = useMediQR();
  
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [result, setResult] = useState(null);
  const [editableMeds, setEditableMeds] = useState([]);
  
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = async (selectedFile) => {
    if (!selectedFile) return;
    
    setFile(selectedFile);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    
    // Only create object URL for actual images (not small dummy files)
    if (selectedFile.size > 500) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl(null);
    }
    
    setIsProcessing(true);
    setResult(null);
    setEditableMeds([]);

    try {
      const decodedData = await decodePrescription(selectedFile);
      setResult(decodedData);
      if (decodedData.success) {
        setEditableMeds(decodedData.medications);
      }
    } catch (err) {
      setResult({
        success: false,
        status: "FAILED",
        message: err.message || 'Failed to process prescription.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleSampleSelect = (e) => {
    const val = e.target.value;
    if (!val) return;
    const dummyFile = new File(["dummy content"], val, { type: "image/png" });
    processFile(dummyFile);
  };

  const handleMedChange = (index, field, value) => {
    const newMeds = [...editableMeds];
    newMeds[index][field] = value;
    setEditableMeds(newMeds);
  };

  const handleRemove = (medId) => {
    const remaining = editableMeds.filter(m => m.id !== medId);
    setEditableMeds(remaining);
    if (remaining.length === 0) {
      handleReset();
    }
  };

  const handleConfirm = (med) => {
    // Convert to proper structure
    const scheduledMed = {
      id: med.id,
      medication: med.medicine,
      dosage: med.dosage,
      frequency: med.frequency
    };
    
    addDecodedPrescriptionToSchedule(scheduledMed);
    
    addPrescriptionToHistory({
      id: med.id,
      date: new Date().toISOString(),
      fileUrl: previewUrl || "Demo Mode",
      medications: [med],
      status: 'Verified'
    });
    
    const remaining = editableMeds.filter(m => m.id !== med.id);
    setEditableMeds(remaining);
    
    if (remaining.length === 0) {
      handleReset();
    }
  };

  const handleReset = () => {
    setResult(null);
    setFile(null);
    setEditableMeds([]);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <section className="glass-panel rounded-xl p-glass-padding flex flex-col gap-6 relative">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">document_scanner</span>
            RxDecode Engine
          </h2>
          <p className="text-on-surface-variant text-body-md">AI-powered prescription transcription via Gemini (Backend).</p>
        </div>
      </div>

      <div className="bg-warning-container/20 border border-warning/30 rounded-lg p-3 flex items-center gap-3">
        <span className="material-symbols-outlined text-warning">warning</span>
        <p className="text-sm text-on-surface-variant">
          <strong className="text-on-surface">Medical Safety Notice:</strong> AI-generated extraction. Verify against the original prescription before use.
        </p>
      </div>

      {!result && !isProcessing ? (
        <>
          {/* Drag & Drop Zone */}
          <div 
            className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer min-h-[180px]
              ${isDragging ? 'bg-primary/20 border-primary scale-[1.02] shadow-[0_0_20px_rgba(0,89,187,0.2)]' : 'bg-gradient-to-b from-primary/5 to-transparent border-primary/30 hover:bg-primary/10 hover:border-primary/60 hover:shadow-lg'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="material-symbols-outlined text-5xl text-primary/60 mb-3">cloud_upload</span>
            <p className="font-bold text-body-lg text-on-surface">Drag & Drop prescription here</p>
            <p className="text-sm text-on-surface-variant mt-1">or click to browse files (JPEG, PNG, WEBP, PDF)</p>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileChange} 
              accept="image/*,.pdf"
            />
          </div>
          
          {/* Sample Selector */}
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center gap-2 mb-1">
               <div className="h-px bg-outline-variant flex-1"></div>
               <span className="text-xs text-outline font-label-caps tracking-widest uppercase bg-surface-container px-2 rounded">DEMO / SAMPLE DATA</span>
               <div className="h-px bg-outline-variant flex-1"></div>
            </div>
            <select 
              className="glass-input w-full p-3 rounded-lg text-body-md text-on-surface focus:ring-primary focus:border-primary transition-all cursor-pointer"
              onChange={handleSampleSelect}
              defaultValue=""
            >
              <option value="" disabled>Select a sample...</option>
              <option value="Amoxicillin 500mg, BD for 7 days">Amoxicillin 500mg, Twice Daily</option>
              <option value="Lisinopril 10mg, OD in morning">Lisinopril 10mg, Once Daily</option>
              <option value="Metformin 850mg, TDS with meals">Metformin 850mg, Three Times Daily</option>
              <option value="error">Simulate Error (Blurry Image)</option>
            </select>
          </div>
        </>
      ) : isProcessing ? (
        <div className="border-2 border-primary/30 bg-primary/5 rounded-xl p-12 flex flex-col items-center justify-center text-center">
          <span className="material-symbols-outlined text-5xl text-primary animate-spin mb-4">progress_activity</span>
          <p className="font-bold text-headline-sm text-primary animate-pulse">Running OCR & AI Analysis...</p>
          <p className="text-sm text-on-surface-variant mt-2">Reading: {file?.name}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in zoom-in-95 duration-300">
          
          {/* Left Column: Original Image */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
               <h3 className="font-bold text-body-lg text-on-surface flex items-center gap-2">
                 <span className="material-symbols-outlined text-primary text-sm">image</span>
                 Original Image
               </h3>
               <button onClick={handleReset} className="text-xs text-primary font-bold hover:underline">Upload Different Image</button>
            </div>
            
            <div className="bg-surface-container-highest/50 dark:bg-surface-container-lowest/50 rounded-xl border border-outline-variant/30 overflow-hidden relative min-h-[300px] flex items-center justify-center p-2">
              {previewUrl ? (
                <img src={previewUrl} alt="Prescription Upload" className="max-w-full max-h-[500px] object-contain rounded-lg shadow-sm" />
              ) : (
                <div className="text-center p-8">
                  <span className="material-symbols-outlined text-4xl text-outline mb-2">plagiarism</span>
                  <p className="text-on-surface-variant text-sm">Demo Data (No Image)</p>
                </div>
              )}
            </div>
            
            {result && (
               <div className={`p-4 rounded-lg border flex flex-col gap-2 ${result.success ? 'bg-primary-container/20 border-primary/30' : 'bg-error-container/20 border-error/30'}`}>
                 <div className="flex items-center gap-2">
                   <span className={`material-symbols-outlined ${result.success ? 'text-primary' : 'text-error'}`}>
                     {result.success ? 'check_circle' : 'error'}
                   </span>
                   <span className="font-bold text-sm tracking-wide uppercase">
                     {result.status.replace('_', ' ')}
                   </span>
                 </div>
                 <p className="text-sm text-on-surface-variant">{result.message}</p>
               </div>
            )}
          </div>
          
          {/* Right Column: Extracted Medications */}
          <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            <h3 className="font-bold text-body-lg text-on-surface flex items-center gap-2">
               <span className="material-symbols-outlined text-primary text-sm">assignment_turned_in</span>
               Extracted Information
            </h3>
            
            {!result.success && (
              <div className="flex flex-col gap-4 items-center justify-center p-8 bg-surface-container/50 rounded-xl border border-outline-variant/50 text-center">
                 <span className="material-symbols-outlined text-4xl text-outline mb-2">find_in_page</span>
                 <p className="text-on-surface font-bold">Unable to confidently identify medication</p>
                 <button onClick={handleReset} className="px-4 py-2 bg-primary text-white font-bold rounded-lg mt-2">Retry Upload</button>
              </div>
            )}

            {editableMeds.map((med, index) => (
              <div key={med.id} className="bg-white/60 dark:bg-white/5 border border-white/80 dark:border-white/10 p-5 rounded-2xl shadow-sm hover:shadow-md flex flex-col gap-4 transition-all duration-300">
                
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-2">
                      <span className="bg-primary text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                        {index + 1}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        med.confidence >= 90 ? 'bg-secondary-container text-on-secondary-container' : 
                        med.confidence >= 70 ? 'bg-warning-container text-on-warning-container' : 
                        'bg-error-container text-on-error-container'
                      }`}>
                        {med.confidence}% Confidence
                      </span>
                   </div>
                   <button onClick={() => handleRemove(med.id)} className="text-outline hover:text-error transition-colors" title="Remove">
                     <span className="material-symbols-outlined text-[18px]">close</span>
                   </button>
                </div>
                
                {med.confidence < 90 && (
                  <div className="bg-warning-container/30 text-on-surface text-xs p-2 rounded border border-warning/20">
                     Please verify this medication name carefully.
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-[10px] text-outline font-bold uppercase tracking-wider block mb-1">Medicine Name</label>
                    <input 
                      type="text"
                      className="glass-input w-full p-2 rounded text-sm text-on-surface font-bold focus:ring-1 focus:ring-primary"
                      value={med.medicine}
                      onChange={(e) => handleMedChange(index, 'medicine', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-outline font-bold uppercase tracking-wider block mb-1">Dosage</label>
                    <input 
                      type="text"
                      className="glass-input w-full p-2 rounded text-sm text-on-surface focus:ring-1 focus:ring-primary"
                      value={med.dosage}
                      onChange={(e) => handleMedChange(index, 'dosage', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-outline font-bold uppercase tracking-wider block mb-1">Frequency</label>
                    <input 
                      type="text"
                      className="glass-input w-full p-2 rounded text-sm text-on-surface focus:ring-1 focus:ring-primary"
                      value={med.frequency}
                      onChange={(e) => handleMedChange(index, 'frequency', e.target.value)}
                    />
                  </div>
                </div>

                <div className="bg-surface-container-highest/30 p-2 rounded text-xs border border-outline-variant/20">
                  <span className="block text-outline mb-1 font-bold">Original Extracted Text:</span>
                  <span className="font-mono text-on-surface-variant break-words">"{med.rawLine}"</span>
                </div>
                
                <button 
                  onClick={() => handleConfirm(med)}
                  className="w-full mt-2 bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">verified</span>
                  Confirm & Add to Schedule
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default RxDecodeEngine;
