<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ServiceArea;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function getCountries()
    {
        \Log::info('getCountries hit');
        $countries = ServiceArea::distinct()->orderBy('country')->pluck('country');
        
        $formatted = $countries->map(function($country) {
            return ['id' => $country, 'name' => $country];
        });

        \Log::info('Countries found: ' . $formatted->count());
        return response()->json(['countries' => $formatted]);
    }

    public function getStates($country)
    {
        $states = ServiceArea::where('country', $country)
            ->distinct()
            ->orderBy('state')
            ->pluck('state');
        
        $formatted = $states->map(function($state) {
            return ['id' => $state, 'name' => $state];
        });

        return response()->json(['states' => $formatted]);
    }

    public function getCities($state)
    {
        $cities = ServiceArea::where('state', $state)
            ->distinct()
            ->orderBy('city')
            ->pluck('city');
        
        $formatted = $cities->map(function($city) {
            return ['id' => $city, 'name' => $city];
        });

        return response()->json(['cities' => $formatted]);
    }

    public function getAreas($city)
    {
        $areas = ServiceArea::where('city', $city)
            ->orderBy('area')
            ->get();
        
        $formatted = $areas->map(function($area) {
            return ['id' => $area->id, 'name' => $area->area];
        });

        return response()->json(['areas' => $formatted]);
    }
}
