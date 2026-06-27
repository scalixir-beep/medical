<?php

namespace App\Http\Controllers;

use App\Models\Analyse;
use Illuminate\Http\Request;

class AnalyseController extends Controller
{
    public function index(Request $request)
    {
        $query = Analyse::join('patients', 'patients.id', '=', 'analyses.patient_id')
            ->select('analyses.*', 'patients.nom', 'patients.prenom', 'patients.code')
            ->orderByDesc('analyses.created_at');

        if ($request->has('statut') && $request->statut !== '') {
            $query->where('analyses.statut', $request->statut);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        if (!$request->patient_id || !$request->type_analyse) {
            return response()->json(['error' => 'Patient et type d\'analyse requis'], 400);
        }

        $analyse = Analyse::create([
            'patient_id'        => $request->patient_id,
            'type_analyse'      => $request->type_analyse,
            'date_demande'      => $request->date_demande ?? now()->toDateString(),
            'medecin_demandeur' => $request->user()->name,
            'statut'            => 'En attente',
        ]);

        return response()->json($analyse, 201);
    }

    public function update(Request $request, $id)
    {
        $analyse = Analyse::findOrFail($id);
        $analyse->update(array_filter([
            'statut'    => $request->statut,
            'resultats' => $request->resultats,
            'alerte'    => $request->has('alerte') ? (bool) $request->alerte : null,
        ], fn($v) => $v !== null));

        return response()->json($analyse);
    }
}
