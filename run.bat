@echo off
echo ===================================================
echo Starting AutoExpertise Project
echo ===================================================

echo [1/2] Starting Backend (Laravel) on port 8001 in a new window...
start "AutoExpertise Backend" cmd /k "cd backend && php artisan serve --port=8001"

echo [2/2] Starting Frontend (React/Vite) in a new window...
start "AutoExpertise Frontend" cmd /k "cd frontend && npm run dev"

echo ===================================================
echo Both servers have been launched in separate windows!
echo ===================================================
