<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('consultations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->string('date');
            $table->string('medecin')->nullable();
            $table->text('motif')->nullable();
            $table->text('diagnostic')->nullable();
            $table->text('traitement')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('consultations');
    }
};
