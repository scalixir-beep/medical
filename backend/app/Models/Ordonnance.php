<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ordonnance extends Model
{
    protected $fillable = ['patient_id', 'date', 'medecin', 'statut', 'medicaments_json'];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
