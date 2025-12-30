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
        Schema::create('booking_issues', function (Blueprint $table) {
            $table->id();
            // Booking this issue relates to
            $table->foreignId('booking_id')->constrained('service_bookings')->onDelete('cascade');
            // Issue description
            $table->text('issue_description');
            // Resolution status
            $table->boolean('is_resolved')->default(false);
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_issues');
    }
};
