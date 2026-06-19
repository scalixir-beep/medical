<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(
            User::orderBy('role')->orderBy('name')
                ->get(['id', 'username', 'name', 'role'])
        );
    }

    public function store(Request $request)
    {
        if (!$request->username || !$request->password || !$request->name || !$request->role) {
            return response()->json(['error' => 'Tous les champs sont requis'], 400);
        }

        $rolesValides = ['Administrateur', 'Médecin', 'Utilisateur'];
        if (!in_array($request->role, $rolesValides)) {
            return response()->json(['error' => 'Rôle invalide'], 400);
        }

        if (User::where('username', $request->username)->exists()) {
            return response()->json(['error' => 'Cet identifiant existe déjà'], 400);
        }

        $user = User::create([
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'name'     => $request->name,
            'role'     => $request->role,
        ]);

        return response()->json($user->only(['id', 'username', 'name', 'role']), 201);
    }

    public function destroy(Request $request, $id)
    {
        if ((int) $id === $request->user()->id) {
            return response()->json(['error' => 'Vous ne pouvez pas supprimer votre propre compte'], 400);
        }

        User::destroy($id);
        return response()->json(['ok' => true]);
    }
}
