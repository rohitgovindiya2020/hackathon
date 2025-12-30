<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

class RealAdminSeeder extends Seeder
{
    public function run(): void
    {
        if (!Admin::where('email', 'admin@example.com')->exists()) {
            Admin::create([
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => Hash::make('Admin@123'),
                'mobile_no' => '1234567890',
            ]);
        }
    }
}
