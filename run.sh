#!/bin/bash

echo "==================================================="
echo "Starting AutoExpertise Project"
echo "==================================================="

# Start backend
echo "[1/2] Starting Backend (Laravel)..."
cd backend || { echo "Backend directory not found!"; exit 1; }
php artisan serve --port=8001 > backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Start frontend
echo "[2/2] Starting Frontend (React/Vite)..."
cd frontend || { echo "Frontend directory not found!"; exit 1; }
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo "==================================================="
echo "Project is now running in the background!"
echo "Backend is running (logs in backend/backend.log)"
echo "Frontend is running (logs in frontend/frontend.log)"
echo "Press [CTRL+C] to stop both servers."
echo "==================================================="

# Trap termination signals to gracefully kill child processes
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT TERM

# Wait for background processes to finish (or until killed)
wait $BACKEND_PID
wait $FRONTEND_PID
