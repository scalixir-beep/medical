<?php

namespace App\Http\Controllers;

use App\Models\ConnexionLog;
use App\Models\User;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    /**
     * Redirige vers la page de consentement Google.
     */
    public function redirect()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    /**
     * Callback Google — crée ou connecte l'utilisateur, retourne un token Sanctum.
     * Le frontend est redirigé vers /login?token=xxx&user=yyy (JSON encodé en base64).
     */
    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
        } catch (\Throwable) {
            return redirect(config('app.frontend_url', 'http://localhost:5173') . '/login?error=google_failed');
        }

        // Chercher par google_id d'abord, puis par email
        $user = User::where('google_id', $googleUser->getId())->first()
            ?? User::where('email', $googleUser->getEmail())->first();

        if ($user) {
            // Mise à jour du google_id et de l'avatar si manquants
            $user->update(array_filter([
                'google_id' => $user->google_id ?? $googleUser->getId(),
                'avatar'    => $googleUser->getAvatar(),
            ]));
        } else {
            // Création automatique avec le rôle Accueil par défaut
            $username = $this->generateUsername($googleUser->getName());
            $user = User::create([
                'username'  => $username,
                'name'      => $googleUser->getName(),
                'password'  => bcrypt(str()->random(32)), // mot de passe inutilisable
                'role'      => 'Accueil',
                'google_id' => $googleUser->getId(),
                'avatar'    => $googleUser->getAvatar(),
            ]);
        }

        $token = $user->createToken('google-auth')->plainTextToken;

        ConnexionLog::create([
            'user_id'  => $user->id,
            'name'     => $user->name,
            'username' => $user->username,
            'role'     => $user->role,
            'date'     => now()->toDateString(),
            'heure'    => now()->format('H:i'),
        ]);

        $payload = base64_encode(json_encode([
            'id'       => $user->id,
            'username' => $user->username,
            'name'     => $user->name,
            'role'     => $user->role,
            'avatar'   => $user->avatar,
        ]));

        $frontendUrl = config('app.frontend_url', 'http://localhost:5173');

        return redirect("{$frontendUrl}/login?token={$token}&user={$payload}");
    }

    private function generateUsername(string $name): string
    {
        $base = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $name));
        $base = $base ?: 'user';
        $candidate = $base;
        $i = 1;
        while (User::where('username', $candidate)->exists()) {
            $candidate = $base . $i++;
        }
        return $candidate;
    }
}
