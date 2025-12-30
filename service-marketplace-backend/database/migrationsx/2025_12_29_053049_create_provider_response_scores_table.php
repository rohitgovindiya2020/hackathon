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
        Schema::create('provider_response_scores', function (Blueprint $table) {
            $table->id();
            // Provider being scored
            $table->foreignId('provider_id')->unique()->constrained('users')->onDelete('cascade');
            // Score metrics
            $table->integer('total_requests')->default(0);
            $table->integer('accepted_requests')->default(0);
            $table->integer('average_response_time_minutes')->default(0);
            // Calculated score (0-100)
            $table->decimal('score', 5, 2)->default(0);
            $table->timestamp('updated_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('provider_response_scores');
    }
};
