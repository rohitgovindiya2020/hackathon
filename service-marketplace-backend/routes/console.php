<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

// Check for expired discounts and send cancellation emails
Schedule::call(function () {
    $expiredDiscounts = \App\Models\Discount::where('interest_to_date', '<', now())
        ->where('is_active', false)
        ->whereColumn('current_interest_count', '<', 'required_interest_count')
        ->whereDoesntHave('interests', function ($query) {
            $query->where('cancellation_email_sent', true);
        })
        ->get();

    foreach ($expiredDiscounts as $discount) {
        // Get all interested customers
        $interests = $discount->interests()->with('customer')->get();
        
        foreach ($interests as $interest) {
            if ($interest->customer && $interest->customer->email) {
                \Illuminate\Support\Facades\Mail::to($interest->customer->email)
                    ->send(new \App\Mail\DiscountCancelled($discount, $interest->customer));
                
                // Mark as sent (we'll need to add this column)
                $interest->update(['cancellation_email_sent' => true]);
            }
        }
    }
})->daily()->name('check-expired-discounts');

// Deactivate discounts where end date has passed
Schedule::call(function () {
    \App\Models\Discount::where('is_active', 1)
        ->where('discount_end_date', '<', now())
        ->update(['is_active' => 0]);
})->daily()->name('deactivate-finished-discounts');
