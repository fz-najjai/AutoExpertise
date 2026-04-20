@echo off
echo ===================================================
echo Starting AutoExpertise Project
echo ===================================================

echo [1/3] Starting Backend (Laravel) on port 8001 in a new window...
start "AutoExpertise Backend" cmd /k "cd backend && php artisan serve --port=8001"

echo [2/3] Starting Reverb WebSocket Server...
start "AutoExpertise Reverb" cmd /k "cd backend && php artisan reverb:start --port=8080"

echo [3/3] Starting Frontend (React/Vite) in a new window...
start "AutoExpertise Frontend" cmd /k "cd frontend && npm run dev"

echo ===================================================
echo All servers have been launched in separate windows!
echo ===================================================
