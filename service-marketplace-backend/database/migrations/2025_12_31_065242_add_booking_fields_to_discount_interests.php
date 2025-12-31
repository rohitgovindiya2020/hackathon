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
        Schema::table('discount_interests', function (Blueprint $table) {
            $table->date('booking_date')->nullable()->after('promo_code');
            $table->time('booking_time')->nullable()->after('booking_date');
            $table->string('booking_status')->default('pending')->after('booking_time'); // pending, approved, suggested
            $table->date('provider_suggested_date')->nullable()->after('booking_status');
            $table->time('provider_suggested_time')->nullable()->after('provider_suggested_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('discount_interests', function (Blueprint $table) {
            $table->dropColumn(['booking_date', 'booking_time', 'booking_status', 'provider_suggested_date', 'provider_suggested_time']);
        });
    }
};
