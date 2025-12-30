<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Country;
use App\Models\State;
use App\Models\City;
use App\Models\Area;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class LocationSeeder extends Seeder
{
    public function run(): void
    {
        // Disable foreign key checks to allow truncation
        Schema::disableForeignKeyConstraints();
        Area::truncate();
        City::truncate();
        State::truncate();
        Country::truncate();
        Schema::enableForeignKeyConstraints();

        // 1. Create Country
        $india = Country::create(['name' => 'India', 'code' => 'IN']);
        // $usa = Country::create(['name' => 'USA', 'code' => 'US']); // Optional

        // 2. Create States (12 States)
        $statesData = [
            'Gujarat', 'Maharashtra', 'Rajasthan', 'Karnataka', 'Tamil Nadu', 
            'Delhi', 'Uttar Pradesh', 'Madhya Pradesh', 'Punjab', 'West Bengal', 
            'Kerala', 'Telangana'
        ];

        $states = [];
        foreach ($statesData as $stateName) {
            $states[$stateName] = State::create(['name' => $stateName, 'country_id' => $india->id]);
        }

        // 3. Create Cities

        // --- Gujarat Cities (Comprehensive List) ---
        $gujaratCities = [
            'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 
            'Gandhinagar', 'Junagadh', 'Anand', 'Nadiad', 'Morbi', 'Mehsana', 
            'Bharuch', 'Vapi', 'Navsari', 'Veraval', 'Porbandar', 'Godhra', 'Bhuj', 'Botad'
        ];

        $cities = [];
        foreach ($gujaratCities as $cityName) {
            $cities[$cityName] = City::create(['name' => $cityName, 'state_id' => $states['Gujarat']->id]);
        }

        // --- Maharashtra Cities (Major ones) ---
        $maharashtraCities = ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Aurangabad', 'Solapur'];
        foreach ($maharashtraCities as $cityName) {
            $cities[$cityName] = City::create(['name' => $cityName, 'state_id' => $states['Maharashtra']->id]);
        }

        // --- Rajasthan Cities (Major ones) ---
        $rajasthanCities = ['Jaipur', 'Udaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer'];
        foreach ($rajasthanCities as $cityName) {
            $cities[$cityName] = City::create(['name' => $cityName, 'state_id' => $states['Rajasthan']->id]);
        }

        // 4. Create Areas

        // --- Surat Areas (Extensive) ---
        $suratAreas = [
            'Adajan', 'Vesu', 'Varachha', 'Katargam', 'Rander', 'Piplod', 'City Light', 
            'Udhna', 'Limbayat', 'Sarthana', 'Amroli', 'Athwa', 'Bamroli', 'Bhestan', 
            'Dindoli', 'Dumas', 'Godadara', 'Jahangirpura', 'Kosad', 'Magdalla', 
            'Majura', 'Mota Varachha', 'Nana Varachha', 'Olpad', 'Pal', 'Pandesara', 
            'Parvat Patia', 'Punagam', 'Sachin', 'Singanpore', 'Utran', 'Ved Road'
        ];
        foreach ($suratAreas as $areaName) {
            Area::create(['name' => $areaName, 'city_id' => $cities['Surat']->id]);
        }

        // --- Ahmedabad Areas (Major) ---
        $ahmedabadAreas = [
            'Satellite', 'Vastrapur', 'Navrangpura', 'Maninagar', 'Gota', 'Bopal', 
            'Naroda', 'Chandkheda', 'Paldi', 'Thaltej', 'Sola', 'Nikol', 'Ranip'
        ];
        foreach ($ahmedabadAreas as $areaName) {
            Area::create(['name' => $areaName, 'city_id' => $cities['Ahmedabad']->id]);
        }

        // --- Vadodara Areas (Sample) ---
        $vadodaraAreas = ['Alkapuri', 'Manjalpur', 'Karelibaug', 'Sayajigunj', 'Gotri'];
        foreach ($vadodaraAreas as $areaName) {
            Area::create(['name' => $areaName, 'city_id' => $cities['Vadodara']->id]);
        }

        // --- Mumbai Areas (Sample) ---
        $mumbaiAreas = ['Andheri', 'Bandra', 'Juhu', 'Dadar', 'Borivali', 'Goregaon', 'Powai'];
        foreach ($mumbaiAreas as $areaName) {
            Area::create(['name' => $areaName, 'city_id' => $cities['Mumbai']->id]);
        }

        // --- Jaipur Areas (Sample) ---
        $jaipurAreas = ['Vaishali Nagar', 'Malviya Nagar', 'Mansarovar', 'Raja Park', 'Jhotwara'];
        foreach ($jaipurAreas as $areaName) {
            Area::create(['name' => $areaName, 'city_id' => $cities['Jaipur']->id]);
        }
    }
}
