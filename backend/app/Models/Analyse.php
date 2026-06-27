<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Analyse extends Model
{
    protected $fillable = [
        'patient_id', 'type_analyse', 'date_demande',
        'medecin_demandeur', 'statut', 'resultats', 'alerte',
    ];

    protected $casts = ['alerte' => 'boolean'];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
