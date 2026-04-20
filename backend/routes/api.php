<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ExpertController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\RecommendationController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ChatController;

// ─── Public routes ─────────────────────────────────────────────────────────────
Route::get('/ping', fn() => response()->json(['message' => 'pong']));

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

// ─── Authenticated routes ───────────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/user', function (Request $request) {
        return $request->user()->load('expertProfile');
    });

    // ── Recommendation & location ─────────────────────────────────────────────
    Route::get('/recommendations',  [RecommendationController::class, 'recommend']);
    Route::patch('/profile/location', [RecommendationController::class, 'updateLocation']);

    // ── Admin routes ──────────────────────────────────────────────────────────
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/dashboard',             [AdminController::class, 'dashboardStats']);
        Route::get('/analytics',             [AdminController::class, 'analytics']);
        Route::get('/experts',               [AdminController::class, 'listExperts']);
        Route::get('/users',                 [AdminController::class, 'listUsers']);
        Route::delete('/users/{id}',         [AdminController::class, 'deleteUser']);
        Route::post('/experts/{id}/approve', [AdminController::class, 'approveExpert']);
        Route::post('/experts/{id}/reject',  [AdminController::class, 'rejectExpert']);
        
        // Ledger & System
        Route::get('/ledger',                [AdminController::class, 'ledger']);
        Route::get('/system/logs',           [AdminController::class, 'systemLogs']);
        Route::get('/trust/safety',          [AdminController::class, 'trustSafety']);

        // Reports
        Route::get('/reports',               [AdminController::class, 'listReports']);
        Route::post('/reports/{id}/process',  [AdminController::class, 'processReport']);

        // Settings
        Route::get('/settings',              [AdminController::class, 'listSettings']);
        Route::patch('/settings/{id}',        [AdminController::class, 'updateSetting']);
    });

    // ── Client routes ─────────────────────────────────────────────────────────
    Route::middleware('role:client')->prefix('client')->group(function () {
        Route::get('/experts',                        [ClientController::class, 'listExperts']);
        Route::get('/experts/{id}',                   [ClientController::class, 'getExpertProfile']);
        Route::get('/experts/{id}/reviews',           [ReviewController::class, 'forExpert']);
        Route::post('/appointments',                  [ClientController::class, 'createAppointment']);
        Route::get('/appointments',                   [ClientController::class, 'listAppointments']);
        Route::get('/history/archives',               [ClientController::class, 'getArchives']);
        Route::get('/history/views',                  [ClientController::class, 'getRecentViews']);
        Route::get('/appointments/{id}',              [ClientController::class, 'getBookingDetails']);
        Route::get('/appointments/{id}/invoice',      [ClientController::class, 'downloadInvoice']);
        Route::put('/appointments/{id}',              [ClientController::class, 'updateAppointment']);
        Route::put('/appointments/{id}/cancel',       [ClientController::class, 'cancelAppointment']);
        Route::post('/reviews',                       [ReviewController::class, 'store']);

        // Payments
        Route::post('/payments/intent',               [PaymentController::class, 'createIntent']);
        Route::post('/payments/confirm',              [PaymentController::class, 'confirmPayment']);

        // Favorites
        Route::get('/favorites',                      [ClientController::class, 'listFavorites']);
        Route::post('/experts/{id}/favorite',         [ClientController::class, 'toggleFavorite']);

        // Support tickets
        Route::get('/support/tickets',                [ClientController::class, 'listSupportTickets']);
        Route::post('/support/tickets',               [ClientController::class, 'createSupportTicket']);

        // Saved searches
        Route::get('/saved-searches',                 [ClientController::class, 'listSavedSearches']);

        // Wallet / payment methods
        Route::get('/wallet',                         [ClientController::class, 'listWallet']);
        Route::post('/wallet',                        [ClientController::class, 'addPaymentMethod']);
    });

    // ── Expert routes ─────────────────────────────────────────────────────────
    Route::middleware(['role:expert', 'expert.approved'])->prefix('expert')->group(function () {
        Route::get('/dashboard',                    [ExpertController::class, 'dashboard']);
        Route::get('/earnings',                     [ExpertController::class, 'getEarnings']);
        Route::get('/performance',                  [ExpertController::class, 'getPerformance']);
        Route::put('/profile',                      [ExpertController::class, 'updateProfile']);
        Route::get('/payouts',                      [ExpertController::class, 'getPayouts']);
        Route::post('/payouts',                     [ExpertController::class, 'requestPayout']);
        Route::put('/settings/schedule',            [ExpertController::class, 'updateSchedule']);
        Route::get('/availabilities',               [ExpertController::class, 'getAvailabilities']);
        Route::post('/availabilities',              [ExpertController::class, 'addAvailability']);
        Route::delete('/availabilities/{id}',       [ExpertController::class, 'deleteAvailability']);
        Route::get('/appointments',                 [ExpertController::class, 'listAppointments']);
        Route::put('/appointments/{id}/manage',     [ExpertController::class, 'manageRequest']);
        Route::get('/reviews',                      [ReviewController::class, 'forExpert']);
    });

    // ── Chat routes ───────────────────────────────────────────────────────────
    Route::get('/conversations',              [ChatController::class, 'index']);
    Route::post('/conversations',             [ChatController::class, 'getOrCreate']);
    Route::get('/conversations/{id}/messages', [ChatController::class, 'messages']);
    Route::post('/conversations/{id}/messages', [ChatController::class, 'send']);
});
