<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('nom');
            $table->string('prenom');
            $table->string('date_naissance')->nullable();
            $table->string('sexe', 1)->nullable();
            $table->string('telephone')->nullable();
            $table->string('adresse')->nullable();
            $table->string('groupe_sanguin')->nullable();
            $table->string('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
