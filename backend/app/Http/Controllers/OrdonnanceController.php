<?php

namespace App\Http\Controllers;

use App\Models\Ordonnance;
use Illuminate\Http\Request;

class OrdonnanceController extends Controller
{
    public function index()
    {
        $rows = Ordonnance::join('patients', 'patients.id', '=', 'ordonnances.patient_id')
            ->select('ordonnances.*', 'patients.nom', 'patients.prenom', 'patients.code')
            ->orderByDesc('ordonnances.created_at')
            ->get();

        return response()->json($rows);
    }

    public function store(Request $request)
    {
        if (!$request->patient_id) {
            return response()->json(['error' => 'Patient requis'], 400);
        }

        $medicaments = $request->medicaments ?? [];
        if (is_array($medicaments) && count(array_filter($medicaments, fn($m) => !empty($m['nom']))) === 0) {
            return response()->json(['error' => 'Ajoutez au moins un médicament.'], 400);
        }

        $ordonnance = Ordonnance::create([
            'patient_id'      => $request->patient_id,
            'date'            => $request->date ?? now()->toDateString(),
            'medecin'         => $request->user()->name,
            'statut'          => 'En attente',
            'medicaments_json'=> json_encode($medicaments),
        ]);

        return response()->json($ordonnance, 201);
    }

    public function update(Request $request, $id)
    {
        $ordonnance = Ordonnance::findOrFail($id);
        $ordonnance->update(['statut' => $request->statut]);

        return response()->json($ordonnance);
    }
}
