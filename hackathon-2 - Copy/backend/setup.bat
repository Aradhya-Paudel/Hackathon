@echo off
echo ========================================
echo Sarkaha Backend Setup
echo ========================================
echo.

echo Creating virtual environment...
python -m venv venv

echo.
echo Activating virtual environment...
call venv\Scripts\activate

echo.
echo Installing dependencies...
pip install -r requirements.txt

echo.
echo Creating .env file...
copy .env.example .env

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the backend:
echo   1. Activate venv: venv\Scripts\activate
echo   2. Run: python main.py
echo.
echo Or simply run: run.bat
echo.
pause

