<?php

namespace App\Http\Controllers;

use App\Models\Medicament;
use Illuminate\Http\Request;

class MedicamentController extends Controller
{
    public function index()
    {
        return response()->json(Medicament::orderBy('nom')->get());
    }

    public function update(Request $request, $id)
    {
        $med = Medicament::findOrFail($id);
        $med->update(['stock' => max(0, (int) $request->stock)]);

        return response()->json($med);
    }
}
