<?php

namespace App\Http\Controllers;

use App\Models\RendezVous;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class RendezVousController extends Controller
{
    #[OA\Get(
        path: '/rendezvous',
        summary: 'Liste des rendez-vous',
        description: 'Retourne tous les rendez-vous triés par date et heure, avec les informations du patient associé.',
        operationId: 'rendezvousIndex',
        security: [['bearerAuth' => []]],
        tags: ['Rendez-vous'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Liste des rendez-vous',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(
                        allOf: [
                            new OA\Schema(ref: '#/components/schemas/RendezVous'),
                            new OA\Schema(properties: [
                                new OA\Property(property: 'nom',    type: 'string', example: 'Diallo'),
                                new OA\Property(property: 'prenom', type: 'string', example: 'Aminata'),
                                new OA\Property(property: 'code',   type: 'string', example: 'PAT-0001'),
                            ]),
                        ],
                    ),
                ),
            ),
            new OA\Response(response: 401, description: 'Non authentifié'),
        ],
    )]
    public function index()
    {
        $rows = RendezVous::join('patients', 'patients.id', '=', 'rendez_vous.patient_id')
            ->select('rendez_vous.*', 'patients.nom', 'patients.prenom', 'patients.code')
            ->orderBy('rendez_vous.date')
            ->orderBy('rendez_vous.heure')
            ->get();

        return response()->json($rows);
    }

    #[OA\Post(
        path: '/rendezvous',
        summary: 'Planifier un rendez-vous',
        description: 'Crée un nouveau rendez-vous pour un patient. Le statut initial est `Planifié`. Le médecin est automatiquement renseigné avec l\'utilisateur connecté si non fourni.',
        operationId: 'rendezvousStore',
        security: [['bearerAuth' => []]],
        tags: ['Rendez-vous'],
        requestBody: new OA\RequestBody(
            required: true,
            description: 'Données du rendez-vous',
            content: new OA\JsonContent(
                required: ['patient_id', 'date'],
                properties: [
                    new OA\Property(property: 'patient_id', type: 'integer', example: 1,
                        description: 'Identifiant du patient'),
                    new OA\Property(property: 'date',       type: 'string', format: 'date', example: '2024-07-15',
                        description: 'Date du rendez-vous'),
                    new OA\Property(property: 'heure',      type: 'string', format: 'time', example: '09:30',
                        description: 'Heure du rendez-vous', nullable: true),
                    new OA\Property(property: 'medecin',    type: 'string', example: 'Dr Ibrahima Sow',
                        description: 'Médecin assigné (utilisateur connecté par défaut)', nullable: true),
                    new OA\Property(property: 'motif',      type: 'string', example: 'Suivi post-opératoire', nullable: true),
                ],
            ),
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Rendez-vous planifié',
                content: new OA\JsonContent(ref: '#/components/schemas/RendezVous'),
            ),
            new OA\Response(
                response: 400,
                description: 'Patient et date requis',
                content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse'),
            ),
            new OA\Response(response: 401, description: 'Non authentifié'),
        ],
    )]
    public function store(Request $request)
    {
        if (!$request->patient_id || !$request->date) {
            return response()->json(['error' => 'Patient et date requis'], 400);
        }

        $rdv = RendezVous::create([
            'patient_id' => $request->patient_id,
            'date'       => $request->date,
            'heure'      => $request->heure,
            'medecin'    => $request->medecin ?? $request->user()->name,
            'motif'      => $request->motif,
            'statut'     => $request->statut  ?? 'Planifié',
        ]);

        return response()->json($rdv, 201);
    }

    #[OA\Patch(
        path: '/rendezvous/{id}',
        summary: 'Mettre à jour le statut d\'un rendez-vous',
        description: 'Modifie le statut d\'un rendez-vous existant. Utilisé pour marquer un RDV comme `Honoré` ou `Annulé`.',
        operationId: 'rendezvousUpdate',
        security: [['bearerAuth' => []]],
        tags: ['Rendez-vous'],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                description: 'Identifiant du rendez-vous',
                schema: new OA\Schema(type: 'integer', example: 1),
            ),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['statut'],
                properties: [
                    new OA\Property(property: 'statut', type: 'string',
                        enum: ['Planifié', 'Honoré', 'Annulé'], example: 'Honoré'),
                ],
            ),
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Statut mis à jour',
                content: new OA\JsonContent(ref: '#/components/schemas/RendezVous'),
            ),
            new OA\Response(response: 401, description: 'Non authentifié'),
            new OA\Response(response: 404, description: 'Rendez-vous introuvable'),
        ],
    )]
    public function update(Request $request, $id)
    {
        $rdv = RendezVous::findOrFail($id);
        $rdv->update(['statut' => $request->statut]);

        return response()->json($rdv);
    }
}
