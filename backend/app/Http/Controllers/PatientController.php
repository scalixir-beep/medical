<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class PatientController extends Controller
{
    #[OA\Get(
        path: '/patients',
        summary: 'Liste des patients',
        description: 'Retourne tous les patients triés par nom. Supporte la recherche par nom, prénom ou code IPP via le paramètre `q`.',
        operationId: 'patientIndex',
        security: [['bearerAuth' => []]],
        tags: ['Patients'],
        parameters: [
            new OA\Parameter(
                name: 'q',
                in: 'query',
                required: false,
                description: 'Terme de recherche (nom, prénom ou code IPP)',
                schema: new OA\Schema(type: 'string', example: 'Diallo'),
            ),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Liste des patients',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(ref: '#/components/schemas/Patient'),
                ),
            ),
            new OA\Response(response: 401, description: 'Non authentifié'),
        ],
    )]
    public function index(Request $request)
    {
        $q     = '%' . trim($request->query('q', '')) . '%';
        $limit = (int) $request->query('limit', 15);
        $page  = max(1, (int) $request->query('page', 1));

        $query = Patient::where('nom',    'like', $q)
            ->orWhere('prenom', 'like', $q)
            ->orWhere('code',   'like', $q)
            ->orderBy('nom')->orderBy('prenom');

        $total    = $query->count();
        $pages    = (int) ceil($total / $limit);
        $data     = $query->skip(($page - 1) * $limit)->take($limit)->get();

        return response()->json(compact('data', 'total', 'pages'));
    }

    #[OA\Get(
        path: '/patients/{id}',
        summary: 'Détail d\'un patient',
        description: 'Retourne le dossier complet d\'un patient avec ses consultations et rendez-vous associés.',
        operationId: 'patientShow',
        security: [['bearerAuth' => []]],
        tags: ['Patients'],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                description: 'Identifiant du patient',
                schema: new OA\Schema(type: 'integer', example: 1),
            ),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Dossier patient complet',
                content: new OA\JsonContent(
                    allOf: [
                        new OA\Schema(ref: '#/components/schemas/Patient'),
                        new OA\Schema(properties: [
                            new OA\Property(
                                property: 'consultations',
                                type: 'array',
                                items: new OA\Items(ref: '#/components/schemas/Consultation'),
                            ),
                            new OA\Property(
                                property: 'rendezvous',
                                type: 'array',
                                items: new OA\Items(ref: '#/components/schemas/RendezVous'),
                            ),
                        ]),
                    ],
                ),
            ),
            new OA\Response(response: 401, description: 'Non authentifié'),
            new OA\Response(
                response: 404,
                description: 'Patient introuvable',
                content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse'),
            ),
        ],
    )]
    public function show($id)
    {
        $patient = Patient::with(['consultations', 'rendezvous'])->find($id);

        if (!$patient) {
            return response()->json(['error' => 'Patient introuvable'], 404);
        }

        return response()->json($patient);
    }

    #[OA\Post(
        path: '/patients',
        summary: 'Créer un patient',
        description: 'Enregistre un nouveau dossier patient. Le code IPP (PAT-XXXX) est généré automatiquement.',
        operationId: 'patientStore',
        security: [['bearerAuth' => []]],
        tags: ['Patients'],
        requestBody: new OA\RequestBody(
            required: true,
            description: 'Données du patient',
            content: new OA\JsonContent(
                required: ['nom', 'prenom'],
                properties: [
                    new OA\Property(property: 'nom',            type: 'string', example: 'Diallo'),
                    new OA\Property(property: 'prenom',         type: 'string', example: 'Aminata'),
                    new OA\Property(property: 'date_naissance', type: 'string', format: 'date',   example: '1990-05-12', nullable: true),
                    new OA\Property(property: 'sexe',           type: 'string', enum: ['M', 'F'], example: 'F',          nullable: true),
                    new OA\Property(property: 'telephone',      type: 'string', example: '+221 77 123 45 67',             nullable: true),
                    new OA\Property(property: 'adresse',        type: 'string', example: 'Dakar, Médina',                 nullable: true),
                    new OA\Property(property: 'groupe_sanguin', type: 'string', example: 'O+',                            nullable: true),
                ],
            ),
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Patient créé',
                content: new OA\JsonContent(ref: '#/components/schemas/Patient'),
            ),
            new OA\Response(
                response: 400,
                description: 'Nom et prénom requis',
                content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse'),
            ),
            new OA\Response(response: 401, description: 'Non authentifié'),
        ],
    )]
    public function store(Request $request)
    {
        if (!$request->nom || !$request->prenom) {
            return response()->json(['error' => 'Nom et prénom requis'], 400);
        }

        $code    = 'PAT-' . str_pad(Patient::count() + 1, 4, '0', STR_PAD_LEFT);
        $patient = Patient::create([
            'code'           => $code,
            'nom'            => $request->nom,
            'prenom'         => $request->prenom,
            'date_naissance' => $request->date_naissance,
            'sexe'           => $request->sexe,
            'telephone'      => $request->telephone,
            'adresse'        => $request->adresse,
            'groupe_sanguin' => $request->groupe_sanguin,
            'created_at'     => now()->toDateString(),
        ]);

        return response()->json($patient, 201);
    }

    #[OA\Delete(
        path: '/patients/{id}',
        summary: 'Supprimer un patient',
        description: 'Supprime définitivement un dossier patient. **Réservé aux Administrateurs.**',
        operationId: 'patientDestroy',
        security: [['bearerAuth' => []]],
        tags: ['Patients'],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                description: 'Identifiant du patient à supprimer',
                schema: new OA\Schema(type: 'integer', example: 1),
            ),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Patient supprimé',
                content: new OA\JsonContent(
                    properties: [new OA\Property(property: 'ok', type: 'boolean', example: true)],
                ),
            ),
            new OA\Response(response: 401, description: 'Non authentifié'),
            new OA\Response(response: 403, description: 'Accès refusé — rôle Administrateur requis'),
        ],
    )]
    public function destroy($id)
    {
        Patient::destroy($id);
        return response()->json(['ok' => true]);
    }
}
