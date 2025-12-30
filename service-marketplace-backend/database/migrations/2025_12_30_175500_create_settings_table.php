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
        Schema::create('settings', function (Blueprint $label) {
            $label->id();
            $label->string('key')->unique();
            $label->text('value')->nullable();
            $label->timestamps();
        });

        // Insert default settings
        DB::table('settings')->insert([
            [
                'key' => 'max_services_per_user',
                'value' => '3',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
