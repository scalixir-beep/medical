<?php

namespace App\Http\Controllers;

use App\Models\DechetMedical;
use Illuminate\Http\Request;

class DechetController extends Controller
{
    public function index(Request $request)
    {
        $q = DechetMedical::query();

        if ($request->query('service')) {
            $q->where('service', $request->query('service'));
        }
        if ($request->query('statut')) {
            $q->where('statut', $request->query('statut'));
        }

        return response()->json($q->orderByDesc('date_collecte')->get());
    }

    public function store(Request $request)
    {
        if (!$request->type_dechet || !$request->quantite || !$request->service || !$request->date_collecte) {
            return response()->json(['error' => 'Type, quantité, service et date sont requis.'], 400);
        }

        $dechet = DechetMedical::create([
            'type_dechet'  => $request->type_dechet,
            'quantite'     => $request->quantite,
            'unite'        => $request->unite ?? 'kg',
            'service'      => $request->service,
            'statut'       => $request->statut ?? 'collecté',
            'date_collecte'=> $request->date_collecte,
            'responsable'  => $request->responsable ?? $request->user()->name,
            'notes'        => $request->notes,
        ]);

        return response()->json($dechet, 201);
    }

    public function update(Request $request, $id)
    {
        $dechet = DechetMedical::findOrFail($id);
        $dechet->update($request->only(['statut', 'notes']));

        return response()->json($dechet);
    }
}
