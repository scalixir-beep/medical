<?php

namespace App\Http\Controllers;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use OpenApi\Attributes as OA;

class UserController extends Controller
{
    #[OA\Get(
        path: '/users',
        summary: 'Liste des utilisateurs',
        description: 'Retourne tous les comptes utilisateurs triés par rôle puis par nom. **Réservé aux Administrateurs.**',
        operationId: 'userIndex',
        security: [['bearerAuth' => []]],
        tags: ['Utilisateurs'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Liste des utilisateurs',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(ref: '#/components/schemas/User'),
                ),
            ),
            new OA\Response(response: 401, description: 'Non authentifié'),
            new OA\Response(response: 403, description: 'Accès refusé — rôle Administrateur requis'),
        ],
    )]
    public function index()
    {
        return response()->json(
            User::orderBy('role')->orderBy('name')
                ->get(['id', 'username', 'name', 'role'])
        );
    }

    #[OA\Post(
        path: '/users',
        summary: 'Créer un compte utilisateur',
        description: 'Crée un nouveau compte avec un rôle défini. L\'identifiant doit être unique. Le mot de passe est hashé automatiquement. **Réservé aux Administrateurs.**',
        operationId: 'userStore',
        security: [['bearerAuth' => []]],
        tags: ['Utilisateurs'],
        requestBody: new OA\RequestBody(
            required: true,
            description: 'Données du compte à créer',
            content: new OA\JsonContent(
                required: ['username', 'password', 'name', 'role'],
                properties: [
                    new OA\Property(property: 'username', type: 'string', example: 'infirmier1',
                        description: 'Identifiant de connexion (unique)'),
                    new OA\Property(property: 'password', type: 'string', format: 'password', example: 'secret123',
                        description: 'Mot de passe en clair (sera hashé)'),
                    new OA\Property(property: 'name',     type: 'string', example: 'Moussa Traoré',
                        description: 'Nom complet affiché'),
                    new OA\Property(property: 'role',     type: 'string',
                        enum: ['Administrateur', 'Médecin', 'Infirmier', 'Accueil', 'Pharmacien', 'Biologiste'],
                        example: 'Infirmier'),
                ],
            ),
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Compte créé',
                content: new OA\JsonContent(ref: '#/components/schemas/User'),
            ),
            new OA\Response(
                response: 400,
                description: 'Champ manquant, rôle invalide ou identifiant déjà pris',
                content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse'),
            ),
            new OA\Response(response: 401, description: 'Non authentifié'),
            new OA\Response(response: 403, description: 'Accès refusé — rôle Administrateur requis'),
        ],
    )]
    public function store(Request $request)
    {
        if (!$request->username || !$request->password || !$request->name || !$request->role) {
            return response()->json(['error' => 'Tous les champs sont requis'], 400);
        }

        if (!in_array($request->role, Role::values())) {
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

    #[OA\Delete(
        path: '/users/{id}',
        summary: 'Supprimer un compte utilisateur',
        description: 'Supprime définitivement un compte utilisateur. Un administrateur ne peut pas supprimer son propre compte. **Réservé aux Administrateurs.**',
        operationId: 'userDestroy',
        security: [['bearerAuth' => []]],
        tags: ['Utilisateurs'],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                description: 'Identifiant du compte à supprimer',
                schema: new OA\Schema(type: 'integer', example: 2),
            ),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Compte supprimé',
                content: new OA\JsonContent(
                    properties: [new OA\Property(property: 'ok', type: 'boolean', example: true)],
                ),
            ),
            new OA\Response(
                response: 400,
                description: 'Impossible de supprimer son propre compte',
                content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse'),
            ),
            new OA\Response(response: 401, description: 'Non authentifié'),
            new OA\Response(response: 403, description: 'Accès refusé — rôle Administrateur requis'),
        ],
    )]
    public function destroy(Request $request, $id)
    {
        if ((int) $id === $request->user()->id) {
            return response()->json(['error' => 'Vous ne pouvez pas supprimer votre propre compte'], 400);
        }

        User::destroy($id);
        return response()->json(['ok' => true]);
    }
}
