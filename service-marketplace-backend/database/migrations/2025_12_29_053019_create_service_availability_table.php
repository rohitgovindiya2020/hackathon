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
        Schema::create('service_availability', function (Blueprint $table) {
            $table->id();
            // Provider setting availability
            $table->foreignId('provider_id')->constrained('users')->onDelete('cascade');
            // Date for availability
            $table->date('date');
            // Is provider available on this date?
            $table->boolean('is_available')->default(true);
            $table->timestamps();
            
            // Ensure one record per provider per date
            $table->unique(['provider_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_availability');
    }
};
