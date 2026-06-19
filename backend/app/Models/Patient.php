<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $fillable = [
        'code', 'nom', 'prenom', 'date_naissance',
        'sexe', 'telephone', 'adresse', 'groupe_sanguin', 'created_at',
    ];

    public $timestamps = false;

    public function consultations()
    {
        return $this->hasMany(Consultation::class)->orderByDesc('date');
    }

    public function rendezvous()
    {
        return $this->hasMany(RendezVous::class)->orderByDesc('date')->orderBy('heure');
    }
}
