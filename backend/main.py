import os
import json
import random
import string
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

app = FastAPI(title="MediQR Backend")

# Allow requests from React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], # adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

@app.post("/api/prescriptions/decode")
async def decode_prescription(file: UploadFile = File(...)):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key not configured on the backend. Please add it to backend/.env")

    try:
        content = await file.read()
        
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-flash-latest')
        
        prompt = """You are an expert medical prescription analyzer. Analyze this prescription image.
        Extract all medications and their details.
        You MUST return the output EXACTLY as a JSON array of objects.
        Each object must have exactly these fields:
        - "medicine": The normalized generic or brand name of the medication.
        - "dosage": The dosage (e.g., "500mg", "10ml"). If none, use "Unknown".
        - "frequency": The frequency (e.g., "Twice Daily", "Once Daily"). Normalize abbreviations like BD, OD, TDS. If none, use "As Directed".
        - "duration": The duration (e.g., "7 days", "1 month"). If none, use "Unknown".
        - "rawLine": The original unedited snippet of text from the prescription that refers to this medication.
        - "confidence": A number from 0 to 100 estimating how confident you are in this extraction.

        If the image does not appear to be a prescription, or you cannot read it at all, return an empty array: []
        Do NOT include markdown formatting like ```json. Return ONLY the raw JSON string array."""
        
        image_parts = [
            {
                "mime_type": file.content_type,
                "data": content
            }
        ]
        
        response = model.generate_content([prompt, image_parts[0]])
        response_text = response.text
        
        clean_json = response_text.replace("```json", "").replace("```", "").strip()
        
        try:
            parsed_meds = json.loads(clean_json)
        except json.JSONDecodeError:
            print(f"JSON Parsing failed: {response_text}")
            raise HTTPException(status_code=500, detail="The AI returned an invalid response format.")

        if not isinstance(parsed_meds, list) or len(parsed_meds) == 0:
            return {
                "success": False,
                "status": "LOW_CONFIDENCE",
                "message": "No recognizable medications found in the prescription. The image may be too blurry or invalid.",
                "rawText": response_text,
                "medications": []
            }
            
        medications = []
        for m in parsed_meds:
            medications.append({
                "id": ''.join(random.choices(string.ascii_lowercase + string.digits, k=9)),
                "medicine": m.get("medicine", "Unknown Medication"),
                "dosage": m.get("dosage", ""),
                "frequency": m.get("frequency", "As Directed"),
                "duration": m.get("duration", ""),
                "confidence": m.get("confidence", 85),
                "rawLine": m.get("rawLine", "Extracted via Gemini AI")
            })

        avg_confidence = sum(m["confidence"] for m in medications) / len(medications)
        status = "HIGH_CONFIDENCE" if avg_confidence >= 85 else "MEDIUM_CONFIDENCE"

        return {
            "success": True,
            "status": status,
            "message": "Prescription analyzed successfully via Gemini AI.",
            "rawText": "Analyzed via Vision AI",
            "medications": medications
        }

    except Exception as e:
        print(f"Error processing prescription: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
