import React from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose}
      ></div>
      <div className="relative glass-panel rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-headline-md text-headline-md text-on-surface">{title}</h3>
          <button 
            onClick={onClose}
            className="text-on-surface-variant hover:text-primary transition-colors p-1 rounded-full hover:bg-primary/10"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
