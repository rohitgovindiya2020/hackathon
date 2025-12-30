<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Discount>
 */
class DiscountFactory extends Factory
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
            'discount_percentage' => fake()->randomFloat(2, 5, 50),
            'discount_start_date' => fake()->dateTimeBetween('now', '+1 month'),
            'discount_end_date' => fake()->dateTimeBetween('+1 month', '+2 months'),
            'is_active' => true,
        ];
    }
}
