<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('hospitalisations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
            $table->string('service');
            $table->string('lit')->nullable();
            $table->date('date_entree');
            $table->date('date_sortie')->nullable();
            $table->string('motif_admission')->nullable();
            $table->text('diagnostic_sortie')->nullable();
            $table->string('statut')->default('En cours'); // En cours / Sorti / Transféré
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hospitalisations');
    }
};
