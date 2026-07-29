# Implementation Plan - MediScan AI & Patient QR Passport

A complete, hackathon-ready web application solution for **MediQR Passport** (Emergency & Doctor Medical History Access via scannable QR / Unique Key) and **RxDecode AI Prescription Scanner** (parsing handwritten/typed prescriptions, decoding shorthand, drug-allergy interaction checking, and providing tailored Patient/Pharmacist views).

## 🚀 Project Overview

The solution solves two major healthcare bottlenecks:
1. **Instant Medical History Transfer**: Doctors get instant 360° patient context (blood type, allergies, surgical history, chronic conditions) via a single scannable QR code or 6-digit Emergency Access Key.
2. **Doctor Prescription Decoding (RxDecode)**: Eliminates dangerous medication errors caused by illegible handwritten doctor prescriptions by scanning, parsing, translating medical shorthand (e.g., `TDS pc`), explaining drug usage in plain English, and warning against patient allergies.

---

## 💡 Recommended Additional Patient Details for QR Profile

To impress hackathon judges, the QR code / Unique Key profile will include:
- **Core Vitals**: Blood Group & Rh factor, Height/Weight, Emergency Contacts.
- **Critical Risk Flags**: Severe Allergies (e.g. Penicillin, Aspirin), Anaphylaxis alerts.
- **Active Conditions**: Diabetes, Hypertension, Asthma, Epilepsy, Pacemaker/Implants (crucial for emergency care/radiology).
- **Medication Ledger**: Current active prescriptions & past adverse drug reactions.
- **Surgical & Hospitalization History**: Dates, procedures, and discharge summaries.
- **Immunization & Donor Status**: Vaccination record, Organ donor preference.

---

## 🎨 Architecture & UI Design

We will build a single-page web app using **HTML5, Modern Vanilla CSS3 design system (Glassmorphic Dark/Light Mode with vibrant health-tech accents), and Vanilla JavaScript**.

### Key Modules:

1. **Header & Navigation Bar**:
   - Live status badge, quick mode toggle (Patient Dashboard / Doctor Portal / Pharmacist Desk), and Theme Switcher.
2. **Module 1: MediQR Passport Generator & Scanner**:
   - Interactive profile builder with real-time live preview.
   - Dynamic QR Code renderer (using client-side QR generation library) + Unique Access Key (`MED-7842-X`).
   - Simulated Doctor Scan Mode: Enter key or simulated scan to instantly pull up the patient's interactive medical record.
3. **Module 2: RxDecode - AI Prescription Scanner & OCR Decoder**:
   - File Dropzone / Camera capture UI + **Pre-loaded Sample Doctor Prescriptions** (messy handwritten and typed) for 1-click instant live demonstration.
   - Parsing Engine: Extracts Drug Name, Strength, Frequency Shorthand (`OD`, `BD`, `TDS`, `QID`, `HS`, `AC`, `PC`), Duration, and Purpose.
   - **Allergy & Interaction Shield**: Cross-checks parsed prescription against current patient profile allergies and triggers high-visibility safety warnings.
   - **Dual Perspective Engine**:
     - *Patient Perspective*: Human-friendly guide, Daily Pill Schedule (Morning/Afternoon/Night timeline), and "Why was this prescribed?".
     - *Pharmacist Perspective*: Dispensing checklist, dosage verification, digital sign-off button, printable dispense summary.
   - **Accessibility Text-to-Speech**: Built-in voice synthesizer to speak instructions aloud.

---

## 📁 Proposed File Structure

- `c:\Users\abelt\OneDrive\Desktop\PRESCRIPTION\`
  - `index.html` — Main UI application structure and view containers.
  - `styles.css` — Custom design system (glassmorphic styling, healthcare color palette, animations, responsive layout).
  - `app.js` — Core application controller, state management, sample data, OCR simulation engine, shorthand translator, and QR generator logic.

---

## 🧪 Verification Plan

### Automated & Manual Verification:
1. **Interactive Demo Verification**:
   - Test Patient Profile editing and immediate QR code re-rendering.
   - Test simulated Doctor Scanner with valid/invalid patient access keys.
   - Test Prescription Scanner using pre-loaded messy doctor handwritten prescriptions.
   - Verify medical shorthand translation accuracy (e.g. `1 tab TDS ac` -> `1 tablet, 3 times a day, Before meals`).
   - Verify Allergy Warning trigger (e.g., scan prescription for Amoxicillin when patient profile has Penicillin allergy).
   - Test Patient Daily Pill Schedule generation and Pharmacist Dispense checklist.
   - Test Text-to-Speech voice synthesis playback.
