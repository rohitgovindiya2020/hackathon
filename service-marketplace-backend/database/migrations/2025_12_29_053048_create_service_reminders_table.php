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
        Schema::create('service_reminders', function (Blueprint $table) {
            $table->id();
            // Customer receiving reminder
            $table->foreignId('customer_id')->constrained('users')->onDelete('cascade');
            // Service to remind about
            $table->foreignId('service_id')->constrained('services')->onDelete('cascade');
            // Reminder configuration
            $table->integer('reminder_interval_months'); // e.g., 6 for every 6 months
            $table->timestamp('last_reminded_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_reminders');
    }
};
