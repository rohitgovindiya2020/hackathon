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
        Schema::table('discounts', function (Blueprint $table) {
            $table->longText('description')->nullable()->after('service_id');
            $table->longText('included_services')->nullable()->after('description');
            $table->decimal('current_price', 10, 2)->nullable()->after('discount_percentage');
            $table->integer('view_count')->default(0)->after('is_active');
            $table->longText('banner_image')->nullable()->after('view_count');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('discounts', function (Blueprint $table) {
            $table->dropColumn(['description', 'included_services', 'current_price', 'view_count', 'banner_image']);
        });
    }
};
