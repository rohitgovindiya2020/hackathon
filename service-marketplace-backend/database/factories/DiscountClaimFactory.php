<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DiscountClaim>
 */
class DiscountClaimFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'customer_id' => \App\Models\Customer::factory(),
            'service_id' => \App\Models\Service::factory(),
            'provider_id' => \App\Models\ServiceProvider::factory(),
            'is_claim' => fake()->boolean(),
        ];
    }
}
