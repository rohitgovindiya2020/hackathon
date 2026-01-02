<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\ServiceProvider;
use App\Models\Service;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats()
    {
        $totalCustomers = Customer::count();
        $totalProviders = ServiceProvider::count();
        $activeServices = Service::where('is_active', true)->count();
        
        return response()->json([
            'stats' => [
                [
                    'title' => 'Total Customers',
                    'value' => number_format($totalCustomers),
                    'change' => '+0%', 
                    'id' => 'customers'
                ],
                [
                    'title' => 'Total Service Providers',
                    'value' => number_format($totalProviders),
                    'change' => '+0%', 
                    'id' => 'providers'
                ],
                [
                    'title' => 'Active Services',
                    'value' => number_format($activeServices),
                    'change' => '+0%', 
                    'id' => 'services'
                ]
            ]
        ]);
    }
}
