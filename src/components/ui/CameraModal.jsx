import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import jsQR from 'jsqr';

const CameraModal = ({ isOpen, onClose, onScanComplete }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    let currentStream = null;
    let animationFrameId = null;

    const scanFrame = () => {
      if (videoRef.current && canvasRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && !isScanning) {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code) {
          // Found a QR code!
          setIsScanning(true);
          video.pause();
          // Simulate slight delay for effect
          setTimeout(() => {
            onScanComplete(code.data);
            handleClose();
          }, 800);
          return; // Stop scanning
        }
      }
      animationFrameId = requestAnimationFrame(scanFrame);
    };

    if (isOpen) {
      setError(null);
      setIsScanning(false);
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then((mediaStream) => {
          currentStream = mediaStream;
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            // Start scanning loop once video plays
            videoRef.current.onplay = () => {
              animationFrameId = requestAnimationFrame(scanFrame);
            };
          }
        })
        .catch((err) => {
          console.error("Camera access error:", err);
          setError("Could not access the camera. Please ensure you have granted permissions.");
        });
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, isScanning, onScanComplete]);

  const handleCapture = () => {
    // If they click scan but no QR is found yet by the loop, alert them.
    if (!isScanning) {
      alert("No QR Code found in frame. Please hold the MediQR Passport up to the camera.");
    }
  };

  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Live Camera Scan">
      <div className="flex flex-col items-center gap-4">
        {error ? (
          <div className="bg-error-container text-on-error-container p-4 rounded-xl text-center">
            <span className="material-symbols-outlined text-4xl mb-2">videocam_off</span>
            <p className="font-bold">Camera Error</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : (
          <div className="relative w-full rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
            {isScanning && (
              <div className="absolute inset-0 z-20 bg-primary/20 backdrop-blur-sm flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-white text-5xl animate-spin mb-2">progress_activity</span>
                <p className="text-white font-bold tracking-widest uppercase">Processing Identity...</p>
              </div>
            )}
            
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className={`w-full h-full object-cover z-10 ${isScanning ? 'opacity-50' : 'opacity-100'}`}
            />
            
            {/* Hidden canvas for taking the actual picture if needed later */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Target overlay overlay */}
            {!isScanning && (
              <div className="absolute inset-0 z-10 pointer-events-none border-[40px] border-black/40">
                <div className="w-full h-full border-2 border-primary/80 border-dashed rounded-lg"></div>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-4 w-full">
          <button 
            onClick={handleClose}
            className="flex-1 py-3 bg-surface-variant text-on-surface-variant font-bold rounded-xl hover:bg-surface-variant/80 transition-colors"
            disabled={isScanning}
          >
            Cancel
          </button>
          {!error && (
            <button 
              onClick={handleCapture}
              disabled={isScanning}
              className="flex-[2] py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <span className="material-symbols-outlined">photo_camera</span>
              Scan Identity
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CameraModal;
