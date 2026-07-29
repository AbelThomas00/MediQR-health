import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useMediQR } from '../context/MediQRContext';
import Modal from './ui/Modal';

const Header = () => {
  const { mode, setMode, isDarkMode, toggleDarkMode, patientData } = useMediQR();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
  // 2FA state
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [show2FAPrompt, setShow2FAPrompt] = useState(false);
  const [twoFAPassword, setTwoFAPassword] = useState("");
  const [twoFAError, setTwoFAError] = useState("");
  
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getNavLinkClass = ({ isActive }) => {
    const base = "text-body-md relative group rounded-lg transition-all duration-300 px-3 py-2 lg:py-1.5 font-bold flex items-center";
    if (isActive) {
      return `${base} text-primary dark:text-primary-fixed-dim bg-primary/10 lg:bg-transparent lg:after:content-[''] lg:after:absolute lg:after:-bottom-1 lg:after:left-1/2 lg:after:-translate-x-1/2 lg:after:w-3/4 lg:after:h-[3px] lg:after:bg-primary lg:after:rounded-full lg:after:transition-all`;
    }
    return `${base} text-on-surface-variant dark:text-outline-variant hover:text-primary hover:bg-primary/5 dark:hover:bg-primary-fixed-dim/10 lg:after:content-[''] lg:after:absolute lg:after:-bottom-1 lg:after:left-1/2 lg:after:-translate-x-1/2 lg:after:w-0 lg:after:h-[3px] lg:after:bg-primary/50 lg:after:rounded-full lg:after:transition-all lg:after:duration-300 lg:hover:after:w-1/2`;
  };

  const handleSignOut = () => {
    setShowProfileMenu(false);
    alert("You have been signed out successfully.");
    window.location.reload();
  };

  const handle2FAEnable = () => {
    if (is2FAEnabled) {
      setIs2FAEnabled(false);
    } else {
      setShow2FAPrompt(true);
      setTwoFAPassword("");
      setTwoFAError("");
    }
  };

  const verify2FAPassword = () => {
    if (twoFAPassword === "1234") {
      setIs2FAEnabled(true);
      setShow2FAPrompt(false);
      setTwoFAPassword("");
      setTwoFAError("");
    } else {
      setTwoFAError("Incorrect password. Please try again.");
    }
  };

  return (
    <header className="bg-surface/70 dark:bg-surface-dim/70 backdrop-blur-xl text-primary dark:text-primary-fixed-dim docked full-width top-0 border-b border-white/20 dark:border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.05)] flex justify-between items-center w-full px-container-padding-desktop max-w-full sticky z-50 py-3 transition-all duration-300" id="top-nav">
      {/* Logo & Brand */}
      <div className="flex items-center gap-4">
        <img alt="MediQR Health Logo" className="h-10 w-10 object-contain rounded-full bg-white p-1 shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYG1mAR19StrCcofmMz0MEOcW8UJ85pcVPx4wtyIgiIKAEbT6CQ0kZGecpmtuuF8P5ikmjugUadXESsbF2J1biphDd9UP4pLhsw7YRTbWtMs6ipyIVfRSbrb7JSnuIUoohzg1UOJFMtdhvv8ksVl7DNzJE5rYx0_cnFC-1KOk7q3xKyrUJSJgNdVLFh3Z5D8fN0cJdn1zp3FYjj4rDbDRdyi1D-hFJzC2XKbYLeLG_rkTai17E_nc9JA"/>
        <h1 className="text-headline-md font-bold text-primary dark:text-primary-fixed-dim tracking-tight hidden md:block">MediQR Health</h1>
      </div>
      
      {/* Navigation Links */}
      <nav className="hidden lg:flex items-center gap-8">
        <NavLink to="/dashboard" className={getNavLinkClass}>
          Dashboard
          <span className="absolute inset-0 bg-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none scale-95 duration-150 ease-in-out"></span>
        </NavLink>
        <NavLink to="/passport" className={getNavLinkClass}>
          MediQR Passport
        </NavLink>
        <NavLink to="/rxdecode" className={getNavLinkClass}>
          RxDecode
        </NavLink>
        <NavLink to="/schedules" className={getNavLinkClass}>
          Schedules
        </NavLink>
        <NavLink to="/diet" className={getNavLinkClass}>
          Diet Plans
        </NavLink>
      </nav>
      
      {/* Actions */}
      <div className="flex items-center gap-2 md:gap-4 relative">
        {/* Mode Toggle */}
        <div className="hidden md:flex items-center bg-surface-container/50 rounded-full p-1 border border-white/30 mr-2 relative" id="mode-toggle">
          <button 
            className={`px-4 py-1.5 rounded-full text-label-caps font-bold transition-all z-10 relative w-24 text-center ${mode === 'patient' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
            onClick={() => setMode('patient')}
          >
            Patient
          </button>
          <button 
            className={`px-4 py-1.5 rounded-full text-label-caps font-bold transition-all z-10 relative w-24 text-center ${mode === 'pharmacist' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
            onClick={() => setMode('pharmacist')}
          >
            Pharmacy
          </button>
        </div>
        
        <button className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-2 sm:px-4 rounded-lg font-bold text-body-md hover:bg-primary/20 transition-colors mr-2 lg:hidden" onClick={() => setMode(mode === 'patient' ? 'pharmacist' : 'patient')}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
          <span className="hidden sm:inline-block md:hidden">{mode === 'patient' ? 'Patient Mode' : 'Pharmacy Mode'}</span>
        </button>

        {/* Dark Mode Toggle */}
        <button 
          className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/10" 
          title="Toggle Theme" 
          onClick={toggleDarkMode}
        >
          <span className="material-symbols-outlined">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/10 relative" 
            title="Notifications"
            onClick={() => setShowNotifMenu(!showNotifMenu)}
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border border-surface"></span>
          </button>
          
          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2 border-b border-outline-variant/30 font-bold text-on-surface">Notifications</div>
              <div className="p-4 text-sm text-on-surface-variant flex gap-3 hover:bg-surface-container-highest cursor-pointer transition-colors">
                <span className="material-symbols-outlined text-primary text-[20px]">medication</span>
                <div>
                  <p className="font-bold text-on-surface">Time for medication</p>
                  <p className="text-xs">Take Lisinopril 10mg now.</p>
                </div>
              </div>
              <div className="p-4 text-sm text-on-surface-variant flex gap-3 hover:bg-surface-container-highest cursor-pointer transition-colors">
                <span className="material-symbols-outlined text-secondary text-[20px]">fact_check</span>
                <div>
                  <p className="font-bold text-on-surface">Rx Verified</p>
                  <p className="text-xs">Your uploaded prescription was added.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Account Profile */}
        <div className="relative" ref={profileRef}>
          <button 
            className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/10 flex items-center" 
            title="Account"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            {patientData ? (
               <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                  {patientData.initials}
               </div>
            ) : (
               <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
            )}
          </button>
          
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-3 border-b border-outline-variant/30">
                <p className="font-bold text-on-surface">{patientData?.name || 'Loading...'}</p>
                <p className="text-xs text-on-surface-variant">{patientData?.id}</p>
              </div>
              <button 
                className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-2"
                onClick={() => { setIsSettingsOpen(true); setShowProfileMenu(false); }}
              >
                 <span className="material-symbols-outlined text-[18px]">settings</span> Settings
              </button>
              <button 
                className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-2"
                onClick={() => { setIsHelpOpen(true); setShowProfileMenu(false); }}
              >
                 <span className="material-symbols-outlined text-[18px]">help</span> Help & Support
              </button>
              <div className="h-px bg-outline-variant/30 my-1"></div>
              <button 
                className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error-container hover:text-on-error-container transition-colors flex items-center gap-2"
                onClick={handleSignOut}
              >
                 <span className="material-symbols-outlined text-[18px]">logout</span> Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden text-on-surface-variant hover:text-primary p-2 transition-colors rounded-full hover:bg-primary/10 z-50 relative"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <span className="material-symbols-outlined">{showMobileMenu ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Mobile Menu Overlay & Drawer */}
      {showMobileMenu && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-surface/95 dark:bg-surface-dim/95 backdrop-blur-xl border-b border-outline-variant/20 shadow-lg animate-in slide-in-from-top-2 fade-in duration-200 z-40">
          <nav className="flex flex-col p-4 gap-2">
            <NavLink to="/dashboard" className={getNavLinkClass} onClick={() => setShowMobileMenu(false)}>
              <span className="material-symbols-outlined mr-3">dashboard</span> Dashboard
            </NavLink>
            <NavLink to="/passport" className={getNavLinkClass} onClick={() => setShowMobileMenu(false)}>
              <span className="material-symbols-outlined mr-3">qr_code_scanner</span> MediQR Passport
            </NavLink>
            <NavLink to="/rxdecode" className={getNavLinkClass} onClick={() => setShowMobileMenu(false)}>
              <span className="material-symbols-outlined mr-3">document_scanner</span> RxDecode
            </NavLink>
            <NavLink to="/schedules" className={getNavLinkClass} onClick={() => setShowMobileMenu(false)}>
              <span className="material-symbols-outlined mr-3">calendar_month</span> Schedules
            </NavLink>
            <NavLink to="/diet" className={getNavLinkClass} onClick={() => setShowMobileMenu(false)}>
              <span className="material-symbols-outlined mr-3">restaurant</span> Diet Plans
            </NavLink>
            
            <div className="h-px bg-outline-variant/20 my-2"></div>
            
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-body-md font-bold text-on-surface-variant">Switch Mode</span>
              <button 
                className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-bold text-sm hover:bg-primary/20 transition-colors"
                onClick={() => {
                  setMode(mode === 'patient' ? 'pharmacist' : 'patient');
                  setShowMobileMenu(false);
                }}
              >
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                {mode === 'patient' ? 'Patient' : 'Pharmacy'}
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Settings Modal */}
      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="Account Settings">
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-label-caps text-outline block mb-1">Email Notifications</label>
            <div className="flex items-center justify-between bg-surface-container-low p-3 rounded-lg border border-outline-variant/30">
              <span className="text-sm font-bold text-on-surface">Daily RX Reminders</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
            </div>
          </div>
          <div>
            <label className="text-xs font-label-caps text-outline block mb-1">Security</label>
            <div className="flex flex-col gap-3 bg-surface-container-low p-3 rounded-lg border border-outline-variant/30">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-on-surface">Two-Factor Authentication</span>
                <button 
                  onClick={handle2FAEnable}
                  className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${is2FAEnabled ? 'bg-error/10 text-error hover:bg-error/20' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
                >
                  {is2FAEnabled ? 'Disable' : 'Enable'}
                </button>
              </div>
              
              {show2FAPrompt && !is2FAEnabled && (
                <div className="mt-2 p-3 bg-surface rounded-md border border-primary/30 animate-in fade-in slide-in-from-top-1">
                  <p className="text-xs text-on-surface-variant mb-2">Please enter your password to enable 2FA:</p>
                  <div className="flex gap-2">
                    <input 
                      type="password" 
                      className="glass-input flex-1 p-1.5 rounded-md text-sm text-on-surface focus:ring-1 focus:ring-primary"
                      placeholder="Password..."
                      value={twoFAPassword}
                      onChange={(e) => setTwoFAPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && verify2FAPassword()}
                    />
                    <button 
                      onClick={verify2FAPassword}
                      className="bg-primary text-white text-xs font-bold px-3 rounded-md hover:bg-primary/90"
                    >
                      Confirm
                    </button>
                  </div>
                  {twoFAError && <p className="text-error text-xs mt-1">{twoFAError}</p>}
                </div>
              )}
            </div>
          </div>
          <div className="pt-4 border-t border-outline-variant/30 flex justify-end">
            <button className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/90" onClick={() => { setIsSettingsOpen(false); setShow2FAPrompt(false); }}>Save Changes</button>
          </div>
        </div>
      </Modal>

      {/* Help Modal */}
      <Modal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} title="Help & Support">
        <div className="flex flex-col gap-4">
          <p className="text-body-md text-on-surface-variant">Having trouble with your MediQR account or scanning a prescription? We're here to help.</p>
          <div className="flex flex-col gap-2">
             <button className="w-full text-left bg-surface-container p-3 rounded-lg border border-outline-variant/30 hover:border-primary transition-colors font-bold text-on-surface flex justify-between">
                FAQ: How do I read my global access key?
                <span className="material-symbols-outlined">chevron_right</span>
             </button>
             <button className="w-full text-left bg-surface-container p-3 rounded-lg border border-outline-variant/30 hover:border-primary transition-colors font-bold text-on-surface flex justify-between">
                Contact Technical Support
                <span className="material-symbols-outlined">chevron_right</span>
             </button>
          </div>
          <div className="pt-4 border-t border-outline-variant/30 flex justify-end">
            <button className="bg-surface-variant text-on-surface-variant font-bold py-2 px-4 rounded-lg hover:bg-surface-variant/80" onClick={() => setIsHelpOpen(false)}>Close</button>
          </div>
        </div>
      </Modal>

    </header>
  );
};

export default Header;
