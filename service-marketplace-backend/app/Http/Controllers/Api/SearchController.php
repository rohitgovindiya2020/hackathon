<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Service;
use App\Models\ServiceProvider;
use App\Models\Discount;

class SearchController extends Controller
{
    public function globalSearch(Request $request)
    {
        $query = $request->get('query');

        if (empty($query)) {
            return response()->json([
                'status' => 'success',
                'data' => [
                    'services' => [],
                    'providers' => [],
                    'discounts' => []
                ]
            ]);
        }

        // Search Services
        $services = Service::where('name', 'LIKE', "%{$query}%")
            ->where('is_active', true)
            ->limit(5)
            ->get();

        // Search Providers
        $providers = ServiceProvider::where('name', 'LIKE', "%{$query}%")
            ->limit(5)
            ->get();

        // Search Discounts
        $discounts = Discount::with(['service', 'address'])
            ->where('is_active', true)
            ->where(function($q) use ($query) {
                $q->where('description', 'LIKE', "%{$query}%")
                  ->orWhere('included_services', 'LIKE', "%{$query}%")
                  ->orWhereHas('address', function($addrQ) use ($query) {
                      $addrQ->where('city', 'LIKE', "%{$query}%")
                            ->orWhere('area', 'LIKE', "%{$query}%");
                  })
                  ->orWhereHas('service', function($serQ) use ($query) {
                      $serQ->where('name', 'LIKE', "%{$query}%");
                  });
            })
            ->limit(5)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'services' => $services,
                'providers' => $providers,
                'discounts' => $discounts
            ]
        ]);
    }
}
