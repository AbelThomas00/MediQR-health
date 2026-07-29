// ==========================================
// 1. FASTAPI BACKEND INTEGRATION
// ==========================================
export const decodePrescription = async (file) => {
  // Demo Mode check (by small size)
  if (file && file.size < 500) {
    return handleDemoMode(file);
  }

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:8000/api/prescriptions/decode", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      let errorDetail = "Backend server error";
      try {
        const errJson = await response.json();
        errorDetail = errJson.detail || errorDetail;
      } catch (e) {}
      
      throw new Error(errorDetail);
    }

    const data = await response.json();
    return data;
    
  } catch (err) {
    console.error("Backend Error:", err);
    let errorMessage = err.message;
    if (errorMessage.includes("Failed to fetch") || errorMessage.includes("NetworkError")) {
      errorMessage = "Cannot connect to the Python backend. Please make sure you have started the FastAPI server on port 8000 (see start-backend.bat).";
    }
    
    return {
      success: false,
      status: "FAILED",
      message: errorMessage,
      rawText: "",
      medications: []
    };
  }
};

// ==========================================
// 2. DEMO MODE HANDLER
// ==========================================
const handleDemoMode = (file) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let medications = [];
      if (file.name.includes('Amoxicillin')) {
        medications.push({
          id: Math.random().toString(36).substr(2, 9),
          medicine: "Amoxicillin",
          dosage: "500mg",
          frequency: "Twice Daily",
          duration: "7 days",
          confidence: 98,
          rawLine: "Amoxicillin 500mg BD x 7d",
        });
      } else if (file.name.includes('Lisinopril')) {
        medications.push({
          id: Math.random().toString(36).substr(2, 9),
          medicine: "Lisinopril",
          dosage: "10mg",
          frequency: "Once Daily",
          duration: "30 days",
          confidence: 96,
          rawLine: "Lisinopril 10mg OD",
        });
      } else if (file.name.includes('Metformin')) {
        medications.push({
          id: Math.random().toString(36).substr(2, 9),
          medicine: "Metformin",
          dosage: "850mg",
          frequency: "Three Times Daily",
          duration: "90 days",
          confidence: 95,
          rawLine: "Metformin 850mg TDS",
        });
      } else if (file.name.includes('error')) {
        resolve({
          success: false,
          status: "LOW_CONFIDENCE",
          message: "We could not confidently read this prescription. Image may be too blurry.",
          rawText: "sfksjdfl sdfjl",
          medications: []
        });
        return;
      }

      resolve({
        success: true,
        status: "HIGH_CONFIDENCE",
        message: "Demo prescription analyzed successfully.",
        rawText: "DEMO DATA",
        medications
      });
    }, 500);
  });
};
