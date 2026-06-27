<?php

namespace App\Http\Controllers;

use App\Models\Consultation;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class ConsultationController extends Controller
{
    #[OA\Get(
        path: '/consultations',
        summary: 'Liste des consultations',
        description: 'Retourne les 50 consultations les plus récentes avec les informations du patient associé. **Réservé aux Médecins et Administrateurs.**',
        operationId: 'consultationIndex',
        security: [['bearerAuth' => []]],
        tags: ['Consultations'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Liste des consultations',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(
                        allOf: [
                            new OA\Schema(ref: '#/components/schemas/Consultation'),
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
            new OA\Response(response: 403, description: 'Accès refusé — rôle Médecin ou Administrateur requis'),
        ],
    )]
    public function index()
    {
        $rows = Consultation::join('patients', 'patients.id', '=', 'consultations.patient_id')
            ->select('consultations.*', 'patients.nom', 'patients.prenom', 'patients.code')
            ->orderByDesc('consultations.date')
            ->limit(50)
            ->get();

        return response()->json($rows);
    }

    #[OA\Post(
        path: '/consultations',
        summary: 'Créer une consultation',
        description: 'Enregistre une nouvelle consultation médicale pour un patient. Le médecin est automatiquement renseigné avec l\'utilisateur connecté si non fourni. **Réservé aux Médecins et Administrateurs.**',
        operationId: 'consultationStore',
        security: [['bearerAuth' => []]],
        tags: ['Consultations'],
        requestBody: new OA\RequestBody(
            required: true,
            description: 'Données de la consultation',
            content: new OA\JsonContent(
                required: ['patient_id'],
                properties: [
                    new OA\Property(property: 'patient_id',  type: 'integer', example: 1,
                        description: 'Identifiant du patient'),
                    new OA\Property(property: 'date',        type: 'string', format: 'date', example: '2024-06-10',
                        description: "Date de la consultation (aujourd'hui par défaut)"),
                    new OA\Property(property: 'medecin',     type: 'string', example: 'Dr Fatou Ndiaye',
                        description: 'Nom du médecin (utilisateur connecté par défaut)', nullable: true),
                    new OA\Property(property: 'motif',       type: 'string', example: 'Douleur abdominale', nullable: true),
                    new OA\Property(property: 'diagnostic',  type: 'string', example: 'Gastrite aiguë', nullable: true),
                    new OA\Property(property: 'traitement',  type: 'string', example: 'Oméprazole 20 mg', nullable: true),
                ],
            ),
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Consultation enregistrée',
                content: new OA\JsonContent(ref: '#/components/schemas/Consultation'),
            ),
            new OA\Response(
                response: 400,
                description: 'Patient requis',
                content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse'),
            ),
            new OA\Response(response: 401, description: 'Non authentifié'),
            new OA\Response(response: 403, description: 'Accès refusé — rôle Médecin ou Administrateur requis'),
        ],
    )]
    public function store(Request $request)
    {
        if (!$request->patient_id) {
            return response()->json(['error' => 'Patient requis'], 400);
        }

        $consultation = Consultation::create([
            'patient_id' => $request->patient_id,
            'date'       => $request->date       ?? now()->toDateString(),
            'medecin'    => $request->medecin    ?? $request->user()->name,
            'motif'      => $request->motif,
            'diagnostic' => $request->diagnostic,
            'traitement' => $request->traitement,
        ]);

        return response()->json($consultation, 201);
    }
}
