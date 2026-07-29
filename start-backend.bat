@echo off
echo ==============================================
echo Starting MediQR FastAPI Backend
echo ==============================================

cd backend

if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing requirements...
pip install -r requirements.txt

echo.
echo ==============================================
echo Server starting on http://localhost:8000
echo Leave this window open!
echo ==============================================
echo.

uvicorn main:app --reload
