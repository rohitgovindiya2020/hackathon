<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use App\Models\Setting;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Schema;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Only load settings if the table exists to prevent errors during migrations
        if (Schema::hasTable('settings')) {
            $settings = Setting::all()->pluck('value', 'key')->toArray();

            if (isset($settings['smtp_host']) && !empty($settings['smtp_host'])) {
                Config::set('mail.default', 'smtp');
                Config::set('mail.mailers.smtp.host', $settings['smtp_host']);
                Config::set('mail.mailers.smtp.port', $settings['smtp_port'] ?? 587);
                Config::set('mail.mailers.smtp.username', $settings['smtp_username'] ?? '');
                Config::set('mail.mailers.smtp.password', $settings['smtp_password'] ?? '');
                Config::set('mail.mailers.smtp.encryption', ($settings['smtp_encryption'] === 'none' || empty($settings['smtp_encryption'])) ? null : $settings['smtp_encryption']);
                Config::set('mail.from.address', $settings['smtp_from_address'] ?? config('mail.from.address'));
                Config::set('mail.from.name', $settings['smtp_from_name'] ?? config('mail.from.name'));
            }
        }
    }
}
