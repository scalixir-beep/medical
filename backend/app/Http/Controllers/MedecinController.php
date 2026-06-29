<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class MedecinController extends Controller
{
    public function index()
    {
        return response()->json(
            User::whereIn('role', ['Médecin', 'Sage-femme'])
                ->orderBy('name')
                ->get(['id', 'name', 'specialite', 'creneaux'])
        );
    }

    public function updateCreneaux(Request $request, $id)
    {
        $medecin = User::findOrFail($id);
        $medecin->update([
            'specialite' => $request->specialite,
            'creneaux'   => $request->creneaux ?? [],
        ]);

        return response()->json($medecin->only(['id', 'name', 'specialite', 'creneaux']));
    }
}
