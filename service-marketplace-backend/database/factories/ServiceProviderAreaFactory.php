<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ServiceProviderArea>
 */
class ServiceProviderAreaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'service_provider_id' => \App\Models\ServiceProvider::factory(),
            'service_area_id' => \App\Models\ServiceArea::factory(),
        ];
    }
}
