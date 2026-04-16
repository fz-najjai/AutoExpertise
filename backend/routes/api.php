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
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    
    Route::get('/user', function (Request $request) {
        return $request->user()->load('expertProfile');
    });

    // Admin routes
    Route::get('/admin/dashboard', [AdminController::class, 'dashboardStats']);
    Route::get('/admin/experts', [AdminController::class, 'listExperts']);
    Route::get('/admin/users', [AdminController::class, 'listUsers']);
    Route::delete('/admin/users/{id}', [AdminController::class, 'deleteUser']);
    Route::post('/admin/validate-expert/{id}', [AdminController::class, 'validateExpert']);

    // Client routes
    Route::get('/client/experts', [ClientController::class, 'listExperts']);
    Route::get('/client/experts/{id}', [ClientController::class, 'getExpertProfile']);
    Route::post('/client/appointments', [ClientController::class, 'createAppointment']);
    Route::get('/client/appointments', [ClientController::class, 'listAppointments']);
    Route::get('/client/appointments/{id}', [ClientController::class, 'getBookingDetails']);
    Route::put('/client/appointments/{id}', [ClientController::class, 'updateAppointment']);
    Route::put('/client/appointments/{id}/cancel', [ClientController::class, 'cancelAppointment']);

    // Expert routes
    Route::get('/expert/dashboard', [ExpertController::class, 'dashboard']);
    Route::put('/expert/profile', [ExpertController::class, 'updateProfile']);
    Route::get('/expert/availabilities', [ExpertController::class, 'getAvailabilities']);
    Route::post('/expert/availabilities', [ExpertController::class, 'addAvailability']);
    Route::delete('/expert/availabilities/{id}', [ExpertController::class, 'deleteAvailability']);
    Route::get('/expert/appointments', [ExpertController::class, 'listAppointments']);
    Route::put('/expert/appointments/{id}/manage', [ExpertController::class, 'manageRequest']);
});
