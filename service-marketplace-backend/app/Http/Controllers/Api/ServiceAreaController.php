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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'country' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'area' => 'required|string|max:255',
        ]);

        $serviceArea = \App\Models\ServiceArea::create($validated);
        return response()->json($serviceArea, 201);
    }

    public function show($id)
    {
        $serviceArea = \App\Models\ServiceArea::findOrFail($id);
        return response()->json($serviceArea);
    }

    public function update(Request $request, $id)
    {
        $serviceArea = \App\Models\ServiceArea::findOrFail($id);
        
        $validated = $request->validate([
            'country' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'area' => 'required|string|max:255',
        ]);

        $serviceArea->update($validated);
        return response()->json($serviceArea);
    }

    public function destroy($id)
    {
        $serviceArea = \App\Models\ServiceArea::findOrFail($id);
        $serviceArea->delete();
        return response()->json(null, 204);
    }
}
