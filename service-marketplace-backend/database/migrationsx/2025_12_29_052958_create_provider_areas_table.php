<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('provider_areas', function (Blueprint $table) {
            $table->id();
            // Provider (user with role='provider')
            $table->foreignId('provider_id')->constrained('users')->onDelete('cascade');
            // Area where provider offers services
            $table->foreignId('area_id')->constrained('areas')->onDelete('cascade');
            $table->timestamps();
            
            // Ensure a provider can't register the same area twice
            $table->unique(['provider_id', 'area_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('provider_areas');
    }
};
