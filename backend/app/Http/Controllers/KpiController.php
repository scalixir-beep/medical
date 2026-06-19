<?php

namespace App\Http\Controllers;

use App\Models\{Consultation, Patient, RendezVous};

class KpiController extends Controller
{
    public function index()
    {
        $today = now()->toDateString();

        $totals = [
            'patients'      => Patient::count(),
            'consultations' => Consultation::count(),
            'rdvAujourdhui' => RendezVous::where('date', $today)->count(),
            'rdvPlanifies'  => RendezVous::where('statut', 'Planifié')->count(),
        ];

        // Consultations sur les 6 derniers mois
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

        // Patients par sexe
        $patientsParSexe = [
            ['name' => 'Féminin',  'value' => Patient::where('sexe', 'F')->count()],
            ['name' => 'Masculin', 'value' => Patient::where('sexe', 'M')->count()],
        ];

        // Rendez-vous par statut
        $rdvParStatut = collect(['Planifié', 'Honoré', 'Annulé'])
            ->map(fn($s) => ['name' => $s, 'value' => RendezVous::where('statut', $s)->count()])
            ->values()->all();

        // Patients par tranche d'âge
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
