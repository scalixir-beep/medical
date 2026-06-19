<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rendez_vous', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->string('date');
            $table->string('heure')->nullable();
            $table->string('medecin')->nullable();
            $table->text('motif')->nullable();
            $table->string('statut')->default('Planifié');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rendez_vous');
    }
};
