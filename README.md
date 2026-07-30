# MediQR Health

> [!WARNING]
> **Active Development:** This project is currently under active development. Features, APIs, and user interfaces are subject to rapid iteration and changes.

MediQR Health is a next-generation, premium health management application designed to bridge the gap between patients and pharmacies. It provides a unified digital health identity and utilizes AI to simplify prescription management.

## 🚀 Features

### 🛂 MediQR Passport
Your unified digital health identity.
- **Digital ID Card**: Stores patient information (Name, DOB, Blood Type, Allergies).
- **Global Access Key**: A unique identifier for secure access.
- **QR Integration**: View your personal QR code, scan other codes via camera, or upload a QR image to securely access health profiles.

### 📝 RxDecode Engine
AI-powered prescription transcription built with Google Gemini.
- **Smart OCR & Extraction**: Drag-and-drop prescriptions (Image/PDF) to instantly extract medication names, dosages, and frequencies.
- **Confidence Scoring**: Visual indicators for AI extraction confidence to ensure medical safety.
- **Seamless Scheduling**: Automatically add verified medications directly to your daily schedule.

### 👥 Dual-Mode Interface
Designed for both sides of healthcare.
- **Patient Mode**: Focuses on personal health metrics, passport management, and daily schedules.
- **Pharmacy Mode**: Designed for healthcare professionals to fetch patient data via Access Keys and verify prescriptions efficiently.

### 📅 Schedules & Diet Plans
- Keep track of daily medication intake with automated notifications and reminders.
- Manage structured diet plans integrated with your health profile.

## 🛠️ Technology Stack

- **React & Vite**: For a lightning-fast, component-driven frontend experience with optimized Hot Module Replacement (HMR).
- **Tailwind CSS**: For utility-first styling, implementing a premium, fully responsive glassmorphism UI with animated gradients and intelligent dark mode support.
- **Google Gemini AI**: Powers the RxDecode Engine, providing state-of-the-art OCR (Optical Character Recognition) and NLP to accurately transcribe physical medical prescriptions into actionable data.
- **React Router**: Manages seamless, client-side routing between the various dashboard modules.
- **QR Code Libraries (`qrcode.react` & `jsqr`)**: Enables secure generation and real-time camera/image decoding of patient global access keys.

## 📦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd MediQR-health
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the URL provided by Vite (typically `http://localhost:5173`).

## 🎨 UI & Design
The application features a highly polished, modern user interface utilizing:
- **Glassmorphism**: Elegant translucent panels with subtle borders.
- **Micro-animations**: Smooth hover transitions, scaling effects, and pulsing states.
- **Dynamic Backgrounds**: Slow-panning animated gradients that give the application a vibrant, living feel.

## ⚠️ Disclaimer
**Medical Safety Notice**: The RxDecode Engine uses AI for transcription. Extracted data should always be verified against the original physical prescription before use.

---
*Built for the future of healthcare accessibility.*
