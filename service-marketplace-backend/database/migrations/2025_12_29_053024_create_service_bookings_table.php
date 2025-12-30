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
        Schema::create('service_bookings', function (Blueprint $table) {
            $table->id();
            // Service being booked
            $table->foreignId('service_id')->constrained('services')->onDelete('cascade');
            // Customer booking the service
            $table->foreignId('customer_id')->constrained('users')->onDelete('cascade');
            // Provider offering the service
            $table->foreignId('provider_id')->constrained('users')->onDelete('cascade');
            // Booking details
            $table->date('booking_date');
            $table->enum('status', ['requested', 'accepted', 'in_progress', 'completed', 'cancelled'])->default('requested');
            // Promo code used (if any)
            $table->foreignId('promo_code_id')->nullable()->constrained('promo_codes')->onDelete('set null');
            // Final price after discount
            $table->decimal('final_price', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_bookings');
    }
};
