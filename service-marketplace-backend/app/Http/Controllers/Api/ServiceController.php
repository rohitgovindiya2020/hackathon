<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Service;
use Illuminate\Support\Facades\Validator;

class ServiceController extends Controller
{
    /**
     * Get discounts by service name.
     */
    public function getByName(Request $request)
    {
        $name = $request->query('name');
        
        // Find exact match first
        $service = Service::where('name', $name)->first();

        // Fallback to like search if no exact match
        if (!$service) {
            $service = Service::where('name', 'LIKE', "%{$name}%")->first();
        }

        if (!$service) {
            return response()->json([
                'status' => 'success',
                'data' => []
            ]);
        }

        // Fetch discounts for this service
        $discounts = \App\Models\Discount::where('service_id', $service->id)
            ->where('discount_end_date', '>=', now())
            ->get();

        // Transform discounts to include service info
        $discountOffers = $discounts->map(function($discount) use ($service) {
            $offer = $discount->toArray();
            
            // Ensure service info is included
            $offer['service_name'] = $service->name;
            $offer['service_image'] = $service->image;
            
            return $offer;
        });

        return response()->json([
            'status' => 'success',
            'data' => $discountOffers
        ]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Reverted to Service::query() to display ALL services
        // Eager load providers to get the name
        $query = Service::with('providers');

        // Search by name
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where('name', 'LIKE', "%{$searchTerm}%");
        }

        // Filter by is_active
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Pagination
        $perPage = $request->get('per_page', 10);
        $services = $query->paginate($perPage);

        $services->getCollection()->transform(function($service) {
            $service->provider = $service->providers->first();
            return $service;
        });

        return response()->json([
            'status' => 'success',
            'data' => $services
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'image' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $service = Service::create($request->all());

        return response()->json([
            'status' => 'success',
            'data' => $service
        ], 211);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $service = Service::with('providers')->find($id);

        if (!$service) {
            return response()->json([
                'status' => 'error',
                'message' => 'Service not found'
            ], 404);
        }

        // Attach singular provider for frontend consistency
        $service->provider = $service->providers->first();

        return response()->json([
            'status' => 'success',
            'data' => $service,
            'service' => $service
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $service = Service::find($id);

        if (!$service) {
            return response()->json([
                'status' => 'error',
                'message' => 'Service not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'image' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $service->update($request->all());

        return response()->json([
            'status' => 'success',
            'data' => $service
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $service = Service::find($id);

        if (!$service) {
            return response()->json([
                'status' => 'error',
                'message' => 'Service not found'
            ], 404);
        }

        $service->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Service deleted successfully'
        ]);
    }
}
