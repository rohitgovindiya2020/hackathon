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
        Schema::create('discounts', function (Blueprint $table) {
            $table->id();
            // Service this discount applies to
            $table->foreignId('service_id')->constrained('services')->onDelete('cascade');
            // Discount configuration
            $table->decimal('discount_percentage', 5, 2); // e.g., 20.00 for 20%
            $table->date('start_date'); // Interest collection start date
            $table->date('end_date'); // Interest collection end date
            // Interest-based activation
            $table->integer('required_interest_count'); // Number of customers needed
            $table->integer('current_interest_count')->default(0); // Current interested customers
            $table->boolean('is_activated')->default(false); // Activation status
            // Promo code configuration
            $table->string('promo_code_prefix', 20)->nullable(); // Prefix for generated codes
            $table->date('validity_end_date')->nullable(); // When promo codes expire
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('discounts');
    }
};
