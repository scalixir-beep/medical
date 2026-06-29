<?php

namespace App\Http\Controllers;

use App\Models\Ambulance;
use Illuminate\Http\Request;

class AmbulanceController extends Controller
{
    public function index()
    {
        return response()->json(
            Ambulance::with('patient:id,nom,prenom,code')
                ->orderByRaw("FIELD(statut,'en mission','disponible','maintenance')")
                ->get()
        );
    }

    public function store(Request $request)
    {
        if (!$request->immatriculation) {
            return response()->json(['error' => "L'immatriculation est requise."], 400);
        }

        $amb = Ambulance::create([
            'immatriculation'     => strtoupper(trim($request->immatriculation)),
            'chauffeur'           => $request->chauffeur,
            'telephone_chauffeur' => $request->telephone_chauffeur,
            'modele'              => $request->modele,
            'statut'              => 'disponible',
            'notes'               => $request->notes,
        ]);

        return response()->json($amb, 201);
    }

    public function update(Request $request, $id)
    {
        $amb = Ambulance::findOrFail($id);

        $data = $request->only([
            'statut', 'patient_id', 'mission_actuelle',
            'debut_mission', 'chauffeur', 'telephone_chauffeur', 'notes',
        ]);

        // libérer la mission quand statut revient à disponible
        if (($data['statut'] ?? null) === 'disponible') {
            $data['patient_id']       = null;
            $data['mission_actuelle'] = null;
            $data['debut_mission']    = null;
        }

        $amb->update($data);

        return response()->json($amb->load('patient:id,nom,prenom,code'));
    }

    public function destroy($id)
    {
        $amb = Ambulance::findOrFail($id);
        if ($amb->statut === 'en mission') {
            return response()->json(['error' => 'Impossible de supprimer une ambulance en mission.'], 422);
        }
        $amb->delete();
        return response()->json(null, 204);
    }
}
