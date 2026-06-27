<?php

namespace App\Http\Controllers;

use App\Models\User;

class MedecinController extends Controller
{
    public function index()
    {
        return response()->json(
            User::where('role', 'Médecin')
                ->orderBy('name')
                ->get(['id', 'name'])
        );
    }
}
