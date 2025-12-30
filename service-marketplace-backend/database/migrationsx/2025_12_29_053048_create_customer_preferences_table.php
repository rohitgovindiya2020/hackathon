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
        Schema::create('customer_preferences', function (Blueprint $table) {
            $table->id();
            // Customer setting preferences
            $table->foreignId('customer_id')->unique()->constrained('users')->onDelete('cascade');
            // Preference details
            $table->string('preferred_time')->nullable(); // e.g., "morning", "afternoon", "evening"
            $table->foreignId('preferred_provider_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('communication_preference')->nullable(); // e.g., "email", "phone", "sms"
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_preferences');
    }
};
