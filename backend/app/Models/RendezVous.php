<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RendezVous extends Model
{
    protected $table    = 'rendez_vous';
    protected $fillable = [
        'patient_id', 'date', 'heure', 'medecin', 'motif', 'statut',
    ];

    public $timestamps = false;
}
