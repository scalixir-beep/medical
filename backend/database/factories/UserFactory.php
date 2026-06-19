<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'username' => fake()->unique()->userName(),
            'password' => Hash::make('password'),
            'name'     => fake()->name(),
            'role'     => fake()->randomElement(['Administrateur', 'Médecin', 'Utilisateur']),
        ];
    }
}
