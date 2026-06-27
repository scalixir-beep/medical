<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hospitalisation extends Model
{
    protected $fillable = [
        'patient_id', 'service', 'lit', 'date_entree',
        'date_sortie', 'motif_admission', 'diagnostic_sortie', 'statut',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
