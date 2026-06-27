<?php

use App\Http\Controllers\GoogleAuthController;
use Illuminate\Support\Facades\Route;

// Routes OAuth Google (web car elles utilisent des redirections HTTP)
Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirect']);
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback']);

Route::get('/', fn() => response()->json(['status' => 'EPS2 API running']));
