<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

use App\Mail\TestEmail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Config;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'key');
        return response()->json($settings);
    }

    public function update(Request $request)
    {
        $data = $request->all();

        foreach ($data as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        return response()->json(['message' => 'Settings updated successfully']);
    }

    public function testEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        // Get settings from request or database
        $settings = $request->input('settings');
        
        if (!$settings) {
            $settings = Setting::all()->pluck('value', 'key')->toArray();
        }

        \Log::info('SMTP Test Request Received', [
            'target_email' => $request->email,
            'settings_keys' => array_keys($settings),
            'host' => $settings['smtp_host'] ?? 'NOT SET',
            'port' => $settings['smtp_port'] ?? 'NOT SET'
        ]);

        // Create a custom temporary mailer configuration
        $config = [
            'transport' => 'smtp',
            'host' => $settings['smtp_host'] ?? '',
            'port' => $settings['smtp_port'] ?? 587,
            'encryption' => ($settings['smtp_encryption'] === 'none' || empty($settings['smtp_encryption'])) ? null : $settings['smtp_encryption'],
            'username' => $settings['smtp_username'] ?? '',
            'password' => $settings['smtp_password'] ?? '',
            'timeout' => 30,
        ];

        Config::set('mail.mailers.smtp_test', $config);
        Config::set('mail.from.address', $settings['smtp_from_address'] ?? config('mail.from.address'));
        Config::set('mail.from.name', $settings['smtp_from_name'] ?? config('mail.from.name'));

        // Force refresh the mailer
        Mail::purge('smtp_test');

        try {
            Mail::mailer('smtp_test')->to($request->email)->send(new TestEmail());
            return response()->json(['message' => 'Test email sent successfully to ' . $request->email]);
        } catch (\Exception $e) {
            \Log::error('SMTP Test Failed', [
                'message' => $e->getMessage(),
                'config_used' => array_merge($config, ['password' => '********'])
            ]);
            return response()->json([
                'message' => 'Failed to send test email: ' . $e->getMessage()
            ], 500);
        }
    }
}
