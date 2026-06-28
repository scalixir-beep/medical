<?php

namespace App\Http\Controllers;

use App\Enums\Service;
use App\Enums\StatutHospit;
use App\Models\Hospitalisation;
use Illuminate\Http\Request;

class HospitalisationController extends Controller
{
    public function index(Request $request)
    {
        $query = Hospitalisation::join('patients', 'patients.id', '=', 'hospitalisations.patient_id')
            ->select('hospitalisations.*', 'patients.nom', 'patients.prenom', 'patients.code')
            ->orderByDesc('hospitalisations.date_entree');

        if ($request->filled('statut')) {
            $query->where('hospitalisations.statut', $request->statut);
        }

        if ($request->filled('service')) {
            $query->where('hospitalisations.service', $request->service);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'service'    => 'required|in:' . implode(',', Service::values()),
        ]);

        $hospit = Hospitalisation::create([
            'patient_id'      => $request->patient_id,
            'service'         => $request->service,
            'lit'             => $request->lit,
            'date_entree'     => $request->date_entree ?? now()->toDateString(),
            'motif_admission' => $request->motif_admission,
            'statut'          => StatutHospit::EnCours->value,
        ]);

        return response()->json($hospit, 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'statut' => 'sometimes|in:' . implode(',', StatutHospit::values()),
        ]);

        $hospit = Hospitalisation::findOrFail($id);
        $hospit->update(array_filter([
            'statut'            => $request->statut,
            'date_sortie'       => $request->date_sortie,
            'diagnostic_sortie' => $request->diagnostic_sortie,
        ], fn($v) => $v !== null));

        return response()->json($hospit);
    }

    /** Retourne les référentiels utiles au frontend */
    public function meta()
    {
        return response()->json([
            'services' => Service::values(),
            'statuts'  => StatutHospit::values(),
        ]);
    }
}
