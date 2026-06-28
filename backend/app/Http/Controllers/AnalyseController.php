<?php

namespace App\Http\Controllers;

use App\Enums\StatutAnalyse;
use App\Models\Analyse;
use Illuminate\Http\Request;

class AnalyseController extends Controller
{
    public function index(Request $request)
    {
        $query = Analyse::join('patients', 'patients.id', '=', 'analyses.patient_id')
            ->select('analyses.*', 'patients.nom', 'patients.prenom', 'patients.code')
            ->orderByDesc('analyses.created_at');

        if ($request->filled('statut')) {
            $query->where('analyses.statut', $request->statut);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'patient_id'   => 'required|exists:patients,id',
            'type_analyse' => 'required|string',
        ]);

        $analyse = Analyse::create([
            'patient_id'        => $request->patient_id,
            'type_analyse'      => $request->type_analyse,
            'date_demande'      => $request->date_demande ?? now()->toDateString(),
            'medecin_demandeur' => $request->user()->name,
            'statut'            => StatutAnalyse::EnAttente->value,
        ]);

        return response()->json($analyse, 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'statut' => 'sometimes|in:' . implode(',', StatutAnalyse::values()),
        ]);

        $analyse = Analyse::findOrFail($id);
        $analyse->update(array_filter([
            'statut'    => $request->statut,
            'resultats' => $request->resultats,
            'alerte'    => $request->has('alerte') ? (bool) $request->alerte : null,
        ], fn($v) => $v !== null));

        return response()->json($analyse);
    }

    /** Retourne les statuts disponibles */
    public function meta()
    {
        return response()->json(['statuts' => StatutAnalyse::values()]);
    }
}
