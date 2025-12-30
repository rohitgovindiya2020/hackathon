<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Country;
use App\Models\State;
use App\Models\City;
use App\Models\Area;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function getCountries()
    {
        $countries = Country::all();
        return response()->json(['countries' => $countries]);
    }

    public function getStates($countryId)
    {
        $states = State::where('country_id', $countryId)->get();
        return response()->json(['states' => $states]);
    }

    public function getCities($stateId)
    {
        $cities = City::where('state_id', $stateId)->get();
        return response()->json(['cities' => $cities]);
    }

    public function getAreas($cityId)
    {
        $areas = Area::where('city_id', $cityId)->get();
        return response()->json(['areas' => $areas]);
    }
}
