<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;

    protected $fillable = ['username', 'password', 'name', 'role', 'google_id', 'avatar'];
    protected $hidden   = ['password'];
    public    $timestamps = false;
}
