<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ServiceAreaController extends Controller
{
    public function index()
    {
        $serviceAreas = \App\Models\ServiceArea::paginate(10);
        return response()->json($serviceAreas);
    }

    public function getCountries()
    {
        $countries = DB::table('service_areas')->distinct()->pluck('country');
        return response()->json($countries);
    }

    public function getStates(Request $request)
    {
        $states = DB::table('service_areas')
            ->where('country', $request->country)
            ->distinct()
            ->pluck('state');
        return response()->json($states);
    }

    public function getCities(Request $request)
    {
        $cities = DB::table('service_areas')
            ->where('state', $request->state)
            ->distinct()
            ->pluck('city');
        return response()->json($cities);
    }

    public function getAreas(Request $request)
    {
        $areas = DB::table('service_areas')
            ->where('city', $request->city)
            ->distinct()
            ->pluck('area');
        return response()->json($areas);
    }
}
