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
        Schema::create('service_photos', function (Blueprint $table) {
            $table->id();
            // Booking this photo relates to
            $table->foreignId('booking_id')->constrained('service_bookings')->onDelete('cascade');
            // Photo type (before or after service)
            $table->enum('photo_type', ['before', 'after']);
            // Path to photo file
            $table->string('photo_path');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_photos');
    }
};
