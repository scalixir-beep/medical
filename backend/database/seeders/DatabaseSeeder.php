<?php

namespace Database\Seeders;

use App\Models\{Consultation, Patient, RendezVous, User};
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Utilisateurs ─────────────────────────────────────────
        User::insert([
            ['username' => 'admin',   'password' => Hash::make('admin'),   'name' => 'Administrateur Système', 'role' => 'Administrateur'],
            ['username' => 'medecin', 'password' => Hash::make('medecin'), 'name' => 'Dr. Amina Diallo',       'role' => 'Médecin'],
            ['username' => 'user',    'password' => Hash::make('user'),    'name' => 'Awa Ndoye (Accueil)',     'role' => 'Utilisateur'],
        ]);

        // ── Patients ──────────────────────────────────────────────
        $demo = [
            ['Ndiaye', 'Fatou',    '1988-04-12', 'F', '77 123 45 67', 'Dakar, Médina',  'O+'],
            ['Sow',    'Mamadou',  '1975-09-30', 'M', '78 234 56 78', 'Pikine',          'A+'],
            ['Faye',   'Awa',      '1995-01-22', 'F', '76 345 67 89', 'Guédiawaye',      'B-'],
            ['Diop',   'Cheikh',   '1962-11-05', 'M', '70 456 78 90', 'Rufisque',        'AB+'],
            ['Ba',     'Aïssatou', '2001-07-18', 'F', '77 567 89 01', 'Thiès',           'O-'],
            ['Gueye',  'Ibrahima', '1958-03-09', 'M', '78 678 90 12', 'Dakar, Plateau',  'A-'],
            ['Sarr',   'Mariama',  '1990-12-25', 'F', '76 789 01 23', 'Mbour',           'B+'],
            ['Fall',   'Ousmane',  '1983-06-14', 'M', '70 890 12 34', 'Kaolack',         'O+'],
            ['Diallo', 'Khady',    '2015-02-03', 'F', '77 901 23 45', 'Saint-Louis',     'AB-'],
            ['Cissé',  'Modou',    '1970-10-21', 'M', '78 012 34 56', 'Ziguinchor',      'A+'],
            ['Sy',     'Ndeye',    '1998-08-30', 'F', '76 123 45 60', 'Dakar, Yoff',     'O+'],
            ['Kane',   'Abdou',    '1948-05-17', 'M', '70 234 56 71', 'Touba',           'B+'],
        ];

        $ids = [];
        foreach ($demo as $i => [$nom, $prenom, $ddn, $sexe, $tel, $adr, $gs]) {
            $ids[] = Patient::create([
                'code'           => 'PAT-' . str_pad($i + 1, 4, '0', STR_PAD_LEFT),
                'nom'            => $nom,
                'prenom'         => $prenom,
                'date_naissance' => $ddn,
                'sexe'           => $sexe,
                'telephone'      => $tel,
                'adresse'        => $adr,
                'groupe_sanguin' => $gs,
                'created_at'     => now()->toDateString(),
            ])->id;
        }

        // ── Consultations (30 actes sur 6 mois) ──────────────────
        $motifs = [
            ['Fièvre persistante',    'Paludisme simple',            'Artéméther-luméfantrine, repos'],
            ['Douleurs thoraciques',  'Hypertension artérielle',     'Amlodipine 5 mg, suivi tensionnel'],
            ['Toux et fièvre',        'Infection respiratoire',      'Amoxicilline, hydratation'],
            ['Contrôle de grossesse', 'Grossesse évolutive normale', 'Acide folique, fer'],
            ['Céphalées',             'Migraine',                    'Paracétamol, repos'],
            ['Douleurs abdominales',  'Gastrite',                    'Oméprazole, régime'],
            ['Contrôle diabète',      'Diabète type 2 équilibré',    'Metformine, suivi glycémique'],
            ['Plaie infectée',        'Infection cutanée',           'Antibiotique local, pansement'],
        ];

        $monthDay = fn(int $mAgo, int $day) => now()->subMonths($mAgo)->startOfMonth()->addDays($day - 1)->toDateString();

        $nbParMois = [3, 4, 5, 6, 5, 7];
        $cIdx      = 0;

        for ($m = 5; $m >= 0; $m--) {
            $nb = $nbParMois[5 - $m];
            for ($k = 0; $k < $nb; $k++) {
                [$motif, $diagnostic, $traitement] = $motifs[$cIdx % count($motifs)];
                $pid = $ids[($cIdx * 3 + $k) % count($ids)];

                Consultation::create([
                    'patient_id' => $pid,
                    'date'       => $monthDay($m, 3 + ($k * 4) % 24),
                    'medecin'    => 'Dr. Amina Diallo',
                    'motif'      => $motif,
                    'diagnostic' => $diagnostic,
                    'traitement' => $traitement,
                ]);
                $cIdx++;
            }
        }

        // ── Rendez-vous ───────────────────────────────────────────
        $addDays = fn(int $n) => now()->addDays($n)->toDateString();

        $rdvData = [
            [$ids[2], $addDays(0),  '09:30', 'Consultation prénatale', 'Planifié'],
            [$ids[3], $addDays(0),  '11:00', 'Suivi cardiologique',    'Planifié'],
            [$ids[1], $addDays(2),  '14:00', 'Bilan tensionnel',       'Planifié'],
            [$ids[4], $addDays(1),  '10:15', 'Consultation générale',  'Planifié'],
            [$ids[0], $addDays(-3), '08:45', 'Contrôle paludisme',     'Honoré'],
            [$ids[5], $addDays(-5), '15:30', 'Bilan cardiaque',        'Honoré'],
            [$ids[6], $addDays(-2), '09:00', 'Suivi grossesse',        'Honoré'],
            [$ids[7], $addDays(-1), '16:00', 'Contrôle diabète',       'Annulé'],
            [$ids[8], $addDays(3),  '11:30', 'Vaccination',            'Planifié'],
            [$ids[9], $addDays(-7), '13:00', 'Consultation',           'Honoré'],
        ];

        foreach ($rdvData as [$pid, $date, $heure, $motif, $statut]) {
            RendezVous::create([
                'patient_id' => $pid,
                'date'       => $date,
                'heure'      => $heure,
                'medecin'    => 'Dr. Amina Diallo',
                'motif'      => $motif,
                'statut'     => $statut,
            ]);
        }
    }
}
