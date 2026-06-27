<?php

namespace App\Http\Controllers;

use App\Models\Hospitalisation;
use Illuminate\Http\Request;

class HospitalisationController extends Controller
{
    public function index(Request $request)
    {
        $query = Hospitalisation::join('patients', 'patients.id', '=', 'hospitalisations.patient_id')
            ->select('hospitalisations.*', 'patients.nom', 'patients.prenom', 'patients.code')
            ->orderByDesc('hospitalisations.date_entree');

        if ($request->has('statut') && $request->statut !== '') {
            $query->where('hospitalisations.statut', $request->statut);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        if (!$request->patient_id || !$request->service) {
            return response()->json(['error' => 'Patient et service requis'], 400);
        }

        $hospit = Hospitalisation::create([
            'patient_id'      => $request->patient_id,
            'service'         => $request->service,
            'lit'             => $request->lit,
            'date_entree'     => $request->date_entree ?? now()->toDateString(),
            'motif_admission' => $request->motif_admission,
            'statut'          => 'En cours',
        ]);

        return response()->json($hospit, 201);
    }

    public function update(Request $request, $id)
    {
        $hospit = Hospitalisation::findOrFail($id);
        $hospit->update(array_filter([
            'statut'            => $request->statut,
            'date_sortie'       => $request->date_sortie,
            'diagnostic_sortie' => $request->diagnostic_sortie,
        ], fn($v) => $v !== null));

        return response()->json($hospit);
    }
}
