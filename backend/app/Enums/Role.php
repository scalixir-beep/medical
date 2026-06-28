<?php

namespace App\Enums;

enum Role: string
{
    case Administrateur = 'Administrateur';
    case Medecin        = 'Médecin';
    case SageFemme      = 'Sage-femme';
    case Infirmier      = 'Infirmier';
    case Accueil        = 'Accueil';
    case Pharmacien     = 'Pharmacien';
    case Biologiste     = 'Biologiste';

    /** Rôles autorisés à s'inscrire eux-mêmes (hors Admin) */
    public static function registrable(): array
    {
        return array_filter(
            self::values(),
            fn($r) => $r !== self::Administrateur->value
        );
    }

    /** Tous les rôles en tableau de chaînes */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
