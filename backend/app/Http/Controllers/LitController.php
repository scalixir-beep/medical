<?php

namespace App\Http\Controllers;

use App\Models\Lit;
use Illuminate\Http\Request;

class LitController extends Controller
{
    public function index(Request $request)
    {
        $q = Lit::with(['patient:id,nom,prenom,code']);

        if ($request->query('service')) {
            $q->where('service', $request->query('service'));
        }
        if ($request->query('statut')) {
            $q->where('statut', $request->query('statut'));
        }

        return response()->json($q->orderBy('service')->orderBy('numero')->get());
    }

    public function store(Request $request)
    {
        $lit = Lit::create([
            'numero'  => $request->numero,
            'service' => $request->service,
            'statut'  => $request->statut ?? 'libre',
            'notes'   => $request->notes,
        ]);

        return response()->json($lit, 201);
    }

    public function update(Request $request, $id)
    {
        $lit = Lit::findOrFail($id);
        $lit->update($request->only(['statut', 'patient_id', 'hospitalisation_id', 'notes']));

        return response()->json($lit->load('patient:id,nom,prenom,code'));
    }

    public function destroy($id)
    {
        $lit = Lit::findOrFail($id);
        if ($lit->statut === 'occupé') {
            return response()->json(['error' => 'Impossible de supprimer un lit occupé.'], 422);
        }
        $lit->delete();
        return response()->json(null, 204);
    }
}
