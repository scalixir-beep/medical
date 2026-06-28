<?php

namespace App\Http\Controllers;

use App\Enums\Role;
use App\Models\ConnexionLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use OpenApi\Attributes as OA;

class AuthController extends Controller
{
    #[OA\Post(
        path: '/login',
        summary: 'Authentification utilisateur',
        description: 'Retourne un Bearer token Sanctum et le profil de l\'utilisateur connecté. Ce token doit être transmis dans le header `Authorization: Bearer {token}` pour toutes les requêtes protégées.',
        operationId: 'login',
        tags: ['Authentification'],
        requestBody: new OA\RequestBody(
            required: true,
            description: 'Identifiants de connexion',
            content: new OA\JsonContent(
                required: ['username', 'password'],
                properties: [
                    new OA\Property(property: 'username', type: 'string', example: 'admin',
                        description: 'Identifiant de connexion'),
                    new OA\Property(property: 'password', type: 'string', format: 'password', example: 'admin',
                        description: 'Mot de passe'),
                ],
            ),
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Connexion réussie',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'token', type: 'string',
                            example: '1|abcdef1234567890',
                            description: 'Token Sanctum à utiliser dans Authorization: Bearer'),
                        new OA\Property(property: 'user', ref: '#/components/schemas/User'),
                    ],
                ),
            ),
            new OA\Response(
                response: 401,
                description: 'Identifiants incorrects',
                content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse'),
            ),
            new OA\Response(response: 422, description: 'Champs manquants ou invalides'),
        ],
    )]
    public function register(Request $request)
    {
        $request->validate([
            'username' => 'required|string|unique:users,username',
            'password' => 'required|string|min:4',
            'name'     => 'required|string',
            'role'     => 'required|in:' . implode(',', Role::registrable()),
        ]);

        $user = User::create([
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'name'     => $request->name,
            'role'     => $request->role,
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        ConnexionLog::create([
            'user_id'  => $user->id,
            'name'     => $user->name,
            'username' => $user->username,
            'role'     => $user->role,
            'date'     => now()->toDateString(),
            'heure'    => now()->format('H:i'),
        ]);

        return response()->json([
            'token' => $token,
            'user'  => [
                'id'       => $user->id,
                'username' => $user->username,
                'name'     => $user->name,
                'role'     => $user->role,
            ],
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('username', $request->username)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Identifiant ou mot de passe incorrect'], 401);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        ConnexionLog::create([
            'user_id'  => $user->id,
            'name'     => $user->name,
            'username' => $user->username,
            'role'     => $user->role,
            'date'     => now()->toDateString(),
            'heure'    => now()->format('H:i'),
        ]);

        return response()->json([
            'token' => $token,
            'user'  => [
                'id'       => $user->id,
                'username' => $user->username,
                'name'     => $user->name,
                'role'     => $user->role,
            ],
        ]);
    }
}
