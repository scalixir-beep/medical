<?php

namespace Database\Seeders;

use App\Enums\Role;
use App\Models\{Consultation, Medicament, Patient, RendezVous, User};
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Utilisateurs — un compte par rôle métier EPS2 ────────
        $users = [
            [Role::Administrateur, 'admin',       'admin',       'Administrateur Système'],
            [Role::Medecin,        'medecin',     'medecin',     'Dr. Amina Diallo'],
            [Role::SageFemme,      'sagefemme',   'sagefemme',   'Mme Rokhaya Mbaye'],
            [Role::Infirmier,      'infirmier',   'infirmier',   'Moussa Diagne'],
            [Role::Accueil,        'accueil',     'accueil',     'Awa Ndoye'],
            [Role::Pharmacien,     'pharmacien',  'pharmacien',  'Ibou Sarr'],
            [Role::Biologiste,     'biologiste',  'biologiste',  'Dr. Fatou Cissé'],
        ];

        User::insert(array_map(fn($u) => [
            'role'     => $u[0]->value,
            'username' => $u[1],
            'password' => Hash::make($u[2]),
            'name'     => $u[3],
        ], $users));

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

        // ── Stock médicaments ─────────────────────────────────────
        $meds = [
            ['Paracétamol 500 mg',      'Comprimé',   250, 50,  'boîte'],
            ['Amoxicilline 500 mg',     'Gélule',     180, 30,  'boîte'],
            ['Artéméther-Luméfantrine', 'Comprimé',    48, 20,  'boîte'],
            ['Amlodipine 5 mg',         'Comprimé',    90, 20,  'boîte'],
            ['Metformine 500 mg',        'Comprimé',   120, 25,  'boîte'],
            ['Oméprazole 20 mg',        'Gélule',      75, 15,  'boîte'],
            ['Ibuprofène 400 mg',       'Comprimé',   200, 40,  'boîte'],
            ['Acide folique 5 mg',      'Comprimé',   160, 30,  'boîte'],
            ['Sulfate ferreux',         'Comprimé',   130, 25,  'boîte'],
            ['Sérum physiologique',     'Injectable',  18,  5,  'flacon'],
            ['Eau ppi 10 ml',           'Injectable',  60, 10,  'ampoule'],
            ['Céfixime 200 mg',         'Gélule',       8, 15,  'boîte'],  // stock bas intentionnel
            ['Insuline Rapide',         'Injectable',   3, 10,  'flacon'], // rupture quasi
            ['Chloroquine 100 mg',      'Comprimé',     0, 20,  'boîte'],  // rupture
        ];

        foreach ($meds as [$nom, $forme, $stock, $seuil, $unite]) {
            Medicament::create(compact('nom', 'forme', 'stock', 'unite') + ['seuil_alerte' => $seuil]);
        }

        // ── Comptes de l'équipe projet ────────────────────────────
        $this->call(TeamSeeder::class);
    }
}
