<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    public function index(Request $request)
    {
        $q = '%' . trim($request->query('q', '')) . '%';

        return response()->json(
            Patient::where('nom',    'like', $q)
                ->orWhere('prenom', 'like', $q)
                ->orWhere('code',   'like', $q)
                ->orderBy('nom')->orderBy('prenom')
                ->get()
        );
    }

    public function show($id)
    {
        $patient = Patient::with(['consultations', 'rendezvous'])->find($id);

        if (!$patient) {
            return response()->json(['error' => 'Patient introuvable'], 404);
        }

        return response()->json($patient);
    }

    public function store(Request $request)
    {
        if (!$request->nom || !$request->prenom) {
            return response()->json(['error' => 'Nom et prénom requis'], 400);
        }

        $code    = 'PAT-' . str_pad(Patient::count() + 1, 4, '0', STR_PAD_LEFT);
        $patient = Patient::create([
            'code'           => $code,
            'nom'            => $request->nom,
            'prenom'         => $request->prenom,
            'date_naissance' => $request->date_naissance,
            'sexe'           => $request->sexe,
            'telephone'      => $request->telephone,
            'adresse'        => $request->adresse,
            'groupe_sanguin' => $request->groupe_sanguin,
            'created_at'     => now()->toDateString(),
        ]);

        return response()->json($patient, 201);
    }

    public function destroy($id)
    {
        Patient::destroy($id);
        return response()->json(['ok' => true]);
    }
}
