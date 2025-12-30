<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ServiceProvider>
 */
class ServiceProviderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'email' => fake()->unique()->safeEmail(),
            'mobile_no' => fake()->phoneNumber(),
            'password' => bcrypt('password'),
            'profile_image' => fake()->imageUrl(),
            'address_id' => \App\Models\Address::factory(),
        ];
    }
}
