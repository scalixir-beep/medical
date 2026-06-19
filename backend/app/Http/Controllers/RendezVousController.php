<?php

namespace App\Http\Controllers;

use App\Models\RendezVous;
use Illuminate\Http\Request;

class RendezVousController extends Controller
{
    public function index()
    {
        $rows = RendezVous::join('patients', 'patients.id', '=', 'rendez_vous.patient_id')
            ->select('rendez_vous.*', 'patients.nom', 'patients.prenom', 'patients.code')
            ->orderBy('rendez_vous.date')
            ->orderBy('rendez_vous.heure')
            ->get();

        return response()->json($rows);
    }

    public function store(Request $request)
    {
        if (!$request->patient_id || !$request->date) {
            return response()->json(['error' => 'Patient et date requis'], 400);
        }

        $rdv = RendezVous::create([
            'patient_id' => $request->patient_id,
            'date'       => $request->date,
            'heure'      => $request->heure,
            'medecin'    => $request->medecin ?? $request->user()->name,
            'motif'      => $request->motif,
            'statut'     => $request->statut  ?? 'Planifié',
        ]);

        return response()->json($rdv, 201);
    }

    public function update(Request $request, $id)
    {
        $rdv = RendezVous::findOrFail($id);
        $rdv->update(['statut' => $request->statut]);

        return response()->json($rdv);
    }
}
