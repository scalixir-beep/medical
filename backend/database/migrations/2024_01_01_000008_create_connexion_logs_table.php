<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('connexion_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->string('username');
            $table->string('role');
            $table->date('date');
            $table->string('heure');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('connexion_logs');
    }
};
