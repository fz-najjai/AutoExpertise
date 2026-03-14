<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ExpertController;
use App\Http\Controllers\AdminController;

Route::get('/ping', function () {
    return response()->json(['message' => 'pong']);
});

Route::post('/register-test', function () {
    return response()->json(['message' => 'reached register-test']);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    
    Route::get('/user', function (Request $request) {
        return $request->user()->load('expertProfile');
    });

    // Admin routes
    Route::post('/admin/validate-expert/{id}', [AdminController::class, 'validateExpert']);

    // Client routes
    Route::get('/client/experts', [ClientController::class, 'listExperts']);
    Route::post('/client/appointments', [ClientController::class, 'createAppointment']);
    Route::get('/client/appointments', [ClientController::class, 'listAppointments']);
    Route::put('/client/appointments/{id}/cancel', [ClientController::class, 'cancelAppointment']);

    // Expert routes
    Route::get('/expert/dashboard', [ExpertController::class, 'dashboard']);
    Route::put('/expert/profile', [ExpertController::class, 'updateProfile']);
    Route::get('/expert/availabilities', [ExpertController::class, 'getAvailabilities']);
    Route::post('/expert/availabilities', [ExpertController::class, 'addAvailability']);
    Route::delete('/expert/availabilities/{id}', [ExpertController::class, 'deleteAvailability']);
    Route::put('/expert/appointments/{id}/manage', [ExpertController::class, 'manageRequest']);
});
