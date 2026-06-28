<?php

namespace App\Enums;

enum StatutHospit: string
{
    case EnCours   = 'En cours';
    case Sorti     = 'Sorti';
    case Transfere = 'Transféré';
    case Decede    = 'Décédé';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
