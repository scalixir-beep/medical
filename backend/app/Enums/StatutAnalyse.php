<?php

namespace App\Enums;

enum StatutAnalyse: string
{
    case EnAttente = 'En attente';
    case EnCours   = 'En cours';
    case Termine   = 'Terminé';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
