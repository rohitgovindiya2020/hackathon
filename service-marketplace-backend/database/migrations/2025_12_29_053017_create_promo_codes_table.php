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
        Schema::create('promo_codes', function (Blueprint $table) {
            $table->id();
            // Discount this promo code belongs to
            $table->foreignId('discount_id')->constrained('discounts')->onDelete('cascade');
            // Customer who received this code
            $table->foreignId('customer_id')->constrained('users')->onDelete('cascade');
            // Unique promo code
            $table->string('code', 50)->unique();
            // Usage tracking
            $table->boolean('is_used')->default(false);
            $table->timestamp('used_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promo_codes');
    }
};
