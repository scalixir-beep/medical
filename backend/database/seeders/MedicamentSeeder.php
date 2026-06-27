<?php

namespace Database\Seeders;

use App\Models\Medicament;
use Illuminate\Database\Seeder;

class MedicamentSeeder extends Seeder
{
    public function run(): void
    {
        if (Medicament::count() > 0) return;

        $meds = [
            ['Paracétamol 500 mg',      'Comprimé',   250, 50,  'boîte'],
            ['Amoxicilline 500 mg',     'Gélule',     180, 30,  'boîte'],
            ['Artéméther-Luméfantrine', 'Comprimé',    48, 20,  'boîte'],
            ['Amlodipine 5 mg',         'Comprimé',    90, 20,  'boîte'],
            ['Metformine 500 mg',       'Comprimé',   120, 25,  'boîte'],
            ['Oméprazole 20 mg',        'Gélule',      75, 15,  'boîte'],
            ['Ibuprofène 400 mg',       'Comprimé',   200, 40,  'boîte'],
            ['Acide folique 5 mg',      'Comprimé',   160, 30,  'boîte'],
            ['Sérum physiologique',     'Injectable',  18,  5,  'flacon'],
            ['Céfixime 200 mg',         'Gélule',       8, 15,  'boîte'],
            ['Insuline Rapide',         'Injectable',   3, 10,  'flacon'],
            ['Chloroquine 100 mg',      'Comprimé',     0, 20,  'boîte'],
        ];

        foreach ($meds as [$nom, $forme, $stock, $seuil, $unite]) {
            Medicament::create([
                'nom'          => $nom,
                'forme'        => $forme,
                'stock'        => $stock,
                'seuil_alerte' => $seuil,
                'unite'        => $unite,
            ]);
        }
    }
}
