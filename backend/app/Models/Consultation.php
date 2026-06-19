<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Consultation extends Model
{
    protected $fillable = [
        'patient_id', 'date', 'medecin', 'motif', 'diagnostic', 'traitement',
    ];

    public $timestamps = false;
}
