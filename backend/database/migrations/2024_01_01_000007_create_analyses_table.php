<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('analyses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
            $table->string('type_analyse');
            $table->date('date_demande')->nullable();
            $table->string('medecin_demandeur')->nullable();
            $table->string('statut')->default('En attente'); // En attente / En cours / Résultat disponible
            $table->text('resultats')->nullable();
            $table->boolean('alerte')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('analyses');
    }
};
