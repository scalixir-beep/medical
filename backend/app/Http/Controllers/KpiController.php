<?php

namespace App\Http\Controllers;

use App\Models\{Consultation, Patient, RendezVous};
use OpenApi\Attributes as OA;

class KpiController extends Controller
{
    #[OA\Get(
        path: '/kpis',
        summary: 'Statistiques et KPIs du tableau de bord',
        description: 'Retourne les indicateurs clés de performance : totaux, évolution des consultations sur 6 mois, répartition des patients par sexe et par tranche d\'âge, statuts des rendez-vous.',
        operationId: 'kpiIndex',
        security: [['bearerAuth' => []]],
        tags: ['Tableau de bord'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Données du tableau de bord',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(
                            property: 'totals',
                            type: 'object',
                            description: 'Totaux globaux',
                            properties: [
                                new OA\Property(property: 'patients',      type: 'integer', example: 142),
                                new OA\Property(property: 'consultations', type: 'integer', example: 873),
                                new OA\Property(property: 'rdvAujourdhui', type: 'integer', example: 7),
                                new OA\Property(property: 'rdvPlanifies',  type: 'integer', example: 23),
                            ],
                        ),
                        new OA\Property(
                            property: 'consultationsParMois',
                            type: 'array',
                            description: 'Consultations des 6 derniers mois',
                            items: new OA\Items(
                                properties: [
                                    new OA\Property(property: 'label', type: 'string',  example: 'Jan'),
                                    new OA\Property(property: 'total', type: 'integer', example: 45),
                                ],
                            ),
                        ),
                        new OA\Property(
                            property: 'patientsParSexe',
                            type: 'array',
                            description: 'Répartition Féminin / Masculin',
                            items: new OA\Items(
                                properties: [
                                    new OA\Property(property: 'name',  type: 'string',  example: 'Féminin'),
                                    new OA\Property(property: 'value', type: 'integer', example: 78),
                                ],
                            ),
                        ),
                        new OA\Property(
                            property: 'rdvParStatut',
                            type: 'array',
                            description: 'Rendez-vous par statut',
                            items: new OA\Items(
                                properties: [
                                    new OA\Property(property: 'name',  type: 'string',  example: 'Planifié'),
                                    new OA\Property(property: 'value', type: 'integer', example: 23),
                                ],
                            ),
                        ),
                        new OA\Property(
                            property: 'patientsParTranche',
                            type: 'array',
                            description: "Répartition par tranche d'âge",
                            items: new OA\Items(
                                properties: [
                                    new OA\Property(property: 'name',  type: 'string',  example: '18-39'),
                                    new OA\Property(property: 'value', type: 'integer', example: 54),
                                ],
                            ),
                        ),
                    ],
                ),
            ),
            new OA\Response(response: 401, description: 'Non authentifié'),
        ],
    )]
    public function index()
    {
        $today = now()->toDateString();

        $totals = [
            'patients'      => Patient::count(),
            'consultations' => Consultation::count(),
            'rdvAujourdhui' => RendezVous::where('date', $today)->count(),
            'rdvPlanifies'  => RendezVous::where('statut', 'Planifié')->count(),
        ];

        $labels              = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
        $consultationsParMois = [];
        for ($i = 5; $i >= 0; $i--) {
            $d   = now()->subMonths($i);
            $key = $d->format('Y-m');
            $consultationsParMois[] = [
                'label' => $labels[$d->month - 1],
                'total' => Consultation::whereRaw("substr(date, 1, 7) = ?", [$key])->count(),
            ];
        }

        $patientsParSexe = [
            ['name' => 'Féminin',  'value' => Patient::where('sexe', 'F')->count()],
            ['name' => 'Masculin', 'value' => Patient::where('sexe', 'M')->count()],
        ];

        $rdvParStatut = collect(['Planifié', 'Honoré', 'Annulé'])
            ->map(fn($s) => ['name' => $s, 'value' => RendezVous::where('statut', $s)->count()])
            ->values()->all();

        $buckets = ['0-17' => 0, '18-39' => 0, '40-59' => 0, '60+' => 0];
        Patient::whereNotNull('date_naissance')->get(['date_naissance'])->each(function ($p) use (&$buckets) {
            $age = (int) now()->diffInYears($p->date_naissance);
            match (true) {
                $age < 18 => $buckets['0-17']++,
                $age < 40 => $buckets['18-39']++,
                $age < 60 => $buckets['40-59']++,
                default   => $buckets['60+']++,
            };
        });
        $patientsParTranche = collect($buckets)
            ->map(fn($v, $k) => ['name' => $k, 'value' => $v])
            ->values()->all();

        return response()->json(compact(
            'totals',
            'consultationsParMois',
            'patientsParSexe',
            'rdvParStatut',
            'patientsParTranche',
        ));
    }
}
