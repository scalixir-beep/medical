<?php

namespace Database\Seeders;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TeamSeeder extends Seeder
{
    public function run(): void
    {
        $team = [
            [
                'username' => 'maodo',
                'email'    => 'kantemaodo@gmail.com',
                'password' => Hash::make('maodo2026'),
                'name'     => 'Maodo Kanté',
                'role'     => Role::Administrateur->value,
            ],
            [
                'username' => 'rogelle',
                'email'    => null,
                'password' => Hash::make('rogelle2026'),
                'name'     => 'Rogelle',
                'role'     => Role::Medecin->value,
            ],
            [
                'username' => 'amine',
                'email'    => null,
                'password' => Hash::make('amine2026'),
                'name'     => 'Amine',
                'role'     => Role::Pharmacien->value,
            ],
            [
                'username' => 'moustapha',
                'email'    => null,
                'password' => Hash::make('moustapha2026'),
                'name'     => 'Moustapha',
                'role'     => Role::Biologiste->value,
            ],
            [
                'username' => 'amineagent',
                'email'    => null,
                'password' => Hash::make('amineagent2026'),
                'name'     => 'Amine (Accueil)',
                'role'     => Role::Accueil->value,
            ],
        ];

        foreach ($team as $member) {
            User::updateOrCreate(
                ['username' => $member['username']],
                $member
            );
        }
    }
}
