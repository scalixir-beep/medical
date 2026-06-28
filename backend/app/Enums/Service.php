<?php

namespace App\Enums;

enum Service: string
{
    case Medecine     = 'Médecine générale';
    case Chirurgie    = 'Chirurgie';
    case Maternite    = 'Maternité';
    case Pediatrie    = 'Pédiatrie';
    case Dialyse      = 'Dialyse';
    case Urgences     = 'Urgences';
    case Oncologie    = 'Oncologie';
    case Cardiologie  = 'Cardiologie';
    case Laboratoire  = 'Laboratoire';
    case Radiologie   = 'Radiologie';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /** Services de la maternité (sage-femme) */
    public static function maternite(): array
    {
        return [self::Maternite->value, self::Pediatrie->value];
    }
}
