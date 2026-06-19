<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    AuthController,
    ConsultationController,
    KpiController,
    PatientController,
    RendezVousController,
    UserController,
};

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/kpis', [KpiController::class, 'index']);

    // ── Patients ──────────────────────────────────────────────
    Route::get('/patients',      [PatientController::class, 'index']);
    Route::get('/patients/{id}', [PatientController::class, 'show']);
    Route::post('/patients',     [PatientController::class, 'store']);

    Route::middleware('role:Administrateur')
        ->delete('/patients/{id}', [PatientController::class, 'destroy']);

    // ── Consultations (Médecin + Admin) ───────────────────────
    Route::middleware('role:Administrateur,Médecin')->group(function () {
        Route::get('/consultations',  [ConsultationController::class, 'index']);
        Route::post('/consultations', [ConsultationController::class, 'store']);
    });

    // ── Rendez-vous ───────────────────────────────────────────
    Route::get('/rendezvous',        [RendezVousController::class, 'index']);
    Route::post('/rendezvous',       [RendezVousController::class, 'store']);
    Route::patch('/rendezvous/{id}', [RendezVousController::class, 'update']);

    // ── Utilisateurs (Admin uniquement) ───────────────────────
    Route::middleware('role:Administrateur')->group(function () {
        Route::get('/users',         [UserController::class, 'index']);
        Route::post('/users',        [UserController::class, 'store']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
    });
});
