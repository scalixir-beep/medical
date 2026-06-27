<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    AnalyseController,
    AuthController,
    ConnexionController,
    ConsultationController,
    HospitalisationController,
    KpiController,
    MedecinController,
    MedicamentController,
    OrdonnanceController,
    PatientController,
    RendezVousController,
    UserController,
};

Route::post('/login',    [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/kpis',     [KpiController::class,     'index']);
    Route::get('/medecins', [MedecinController::class, 'index']);

    // ── Patients ──────────────────────────────────────────────────────────
    Route::get('/patients',      [PatientController::class, 'index']);
    Route::get('/patients/{id}', [PatientController::class, 'show']);
    Route::post('/patients',     [PatientController::class, 'store']);
    Route::middleware('role:Administrateur')
        ->delete('/patients/{id}', [PatientController::class, 'destroy']);

    // ── Consultations (Médecin + Admin) ───────────────────────────────────
    Route::middleware('role:Administrateur,Médecin')->group(function () {
        Route::get('/consultations',  [ConsultationController::class, 'index']);
        Route::post('/consultations', [ConsultationController::class, 'store']);
    });

    // ── Rendez-vous ────────────────────────────────────────────────────────
    Route::get('/rendezvous',        [RendezVousController::class,     'index']);
    Route::post('/rendezvous',       [RendezVousController::class,     'store']);
    Route::patch('/rendezvous/{id}', [RendezVousController::class,     'update']);

    // ── Ordonnances ────────────────────────────────────────────────────────
    Route::get('/ordonnances',        [OrdonnanceController::class, 'index']);
    Route::post('/ordonnances',       [OrdonnanceController::class, 'store']);
    Route::patch('/ordonnances/{id}', [OrdonnanceController::class, 'update']);

    // ── Médicaments (stock) ────────────────────────────────────────────────
    Route::get('/medicaments',        [MedicamentController::class, 'index']);
    Route::patch('/medicaments/{id}', [MedicamentController::class, 'update']);

    // ── Hospitalisation ────────────────────────────────────────────────────
    Route::get('/hospitalisations',        [HospitalisationController::class, 'index']);
    Route::post('/hospitalisations',       [HospitalisationController::class, 'store']);
    Route::patch('/hospitalisations/{id}', [HospitalisationController::class, 'update']);

    // ── Laboratoire ────────────────────────────────────────────────────────
    Route::get('/analyses',        [AnalyseController::class, 'index']);
    Route::post('/analyses',       [AnalyseController::class, 'store']);
    Route::patch('/analyses/{id}', [AnalyseController::class, 'update']);

    // ── Historique connexions (Admin) ──────────────────────────────────────
    Route::middleware('role:Administrateur')
        ->get('/connexions', [ConnexionController::class, 'index']);

    // ── Utilisateurs (Admin) ───────────────────────────────────────────────
    Route::middleware('role:Administrateur')->group(function () {
        Route::get('/users',         [UserController::class, 'index']);
        Route::post('/users',        [UserController::class, 'store']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
    });
});
