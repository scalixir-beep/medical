<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('medicaments', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('forme')->nullable();         // Comprimé, Sirop, Injectable…
            $table->integer('stock')->default(0);
            $table->integer('seuil_alerte')->default(10);
            $table->string('unite')->default('unité');   // boîte, flacon, ampoule…
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medicaments');
    }
};
