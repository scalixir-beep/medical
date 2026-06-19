<?php

namespace App\Http\Controllers;

use App\Models\Consultation;
use Illuminate\Http\Request;

class ConsultationController extends Controller
{
    public function index()
    {
        $rows = Consultation::join('patients', 'patients.id', '=', 'consultations.patient_id')
            ->select('consultations.*', 'patients.nom', 'patients.prenom', 'patients.code')
            ->orderByDesc('consultations.date')
            ->limit(50)
            ->get();

        return response()->json($rows);
    }

    public function store(Request $request)
    {
        if (!$request->patient_id) {
            return response()->json(['error' => 'Patient requis'], 400);
        }

        $consultation = Consultation::create([
            'patient_id' => $request->patient_id,
            'date'       => $request->date       ?? now()->toDateString(),
            'medecin'    => $request->medecin    ?? $request->user()->name,
            'motif'      => $request->motif,
            'diagnostic' => $request->diagnostic,
            'traitement' => $request->traitement,
        ]);

        return response()->json($consultation, 201);
    }
}
