<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConnexionLog extends Model
{
    protected $fillable = ['user_id', 'name', 'username', 'role', 'date', 'heure'];
}
