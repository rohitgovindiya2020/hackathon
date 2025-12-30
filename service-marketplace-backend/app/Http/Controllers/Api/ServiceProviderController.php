<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ServiceProviderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = ServiceProvider::with(['address', 'services', 'areas', 'media', 'discounts.interests', 'reviews']);

        // Handle Search
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'LIKE', "%$search%")
                  ->orWhere('email', 'LIKE', "%$search%")
                  ->orWhere('mobile_no', 'LIKE', "%$search%");
            });
        }

        // Handle Pagination
        $perPage = $request->get('per_page', 10);
        $providers = $query->latest()->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $providers->items(),
            'meta' => [
                'current_page' => $providers->currentPage(),
                'last_page' => $providers->lastPage(),
                'per_page' => $providers->perPage(),
                'total' => $providers->total(),
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:service_providers,email|unique:customers|unique:admins',
            'mobile_no' => 'required|string|max:20',
            'profile_image' => 'nullable|string',
            'password' => 'required|string|min:8|confirmed',
            'status' => 'required',
            'description' => 'nullable|string'
        ]);

        if (isset($validated['status'])) {
            $status = $validated['status'];
            $validated['status'] = ((int)$status === 1 || $status === 'active' || $status === true || $status === 'true') ? 1 : 0;
        }

        $validated['password'] = Hash::make($validated['password']);

        $provider = ServiceProvider::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Service Provider created successfully',
            'data' => $provider
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $provider = ServiceProvider::with(['address', 'services', 'areas', 'media', 'discounts', 'reviews.customer'])->find($id);
        
        if (!$provider) {
            return response()->json([
                'success' => false,
                'message' => 'Service Provider not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $provider
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $provider = ServiceProvider::find($id);
        if (!$provider) {
            return response()->json([
                'success' => false,
                'message' => 'Service Provider not found'
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:service_providers,email,' . $id . '|unique:customers|unique:admins',
            'mobile_no' => 'sometimes|required|string|max:20',
            'profile_image' => 'nullable|string',
            'status' => 'sometimes',
            'description' => 'nullable|string'
        ]);

        if (isset($validated['status'])) {
            $status = $validated['status'];
            $validated['status'] = ((int)$status === 1 || $status === 'active' || $status === true || $status === 'true') ? 1 : 0;
        }

        $provider->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Service Provider updated successfully',
            'data' => $provider->load('address')
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $provider = ServiceProvider::find($id);
        if (!$provider) {
            return response()->json([
                'success' => false,
                'message' => 'Service Provider not found'
            ], 404);
        }

        $provider->delete();

        return response()->json([
            'success' => true,
            'message' => 'Service Provider deleted successfully'
        ]);
    }
}
