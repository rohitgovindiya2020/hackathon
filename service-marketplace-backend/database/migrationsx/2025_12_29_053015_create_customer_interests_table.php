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
        Schema::create('customer_interests', function (Blueprint $table) {
            $table->id();
            // Customer showing interest
            $table->foreignId('customer_id')->constrained('users')->onDelete('cascade');
            // Discount they're interested in
            $table->foreignId('discount_id')->constrained('discounts')->onDelete('cascade');
            $table->timestamps();
            
            // Ensure a customer can only show interest once per discount
            $table->unique(['customer_id', 'discount_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_interests');
    }
};
