<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProviderServiceController extends Controller
{
    /**
     * Get the logged-in provider's services.
     */
    public function index()
    {
        $provider = Auth::user();

        if (!$provider instanceof ServiceProvider) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized. Only service providers can access this.'
            ], 403);
        }

        return response()->json([
            'status' => 'success',
            'data' => $provider->services
        ]);
    }

    /**
     * Attach a service to the provider.
     */
    public function store(Request $request)
    {
        $provider = Auth::user();

        if (!$provider instanceof ServiceProvider) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized.'
            ], 403);
        }

        $request->validate([
            'service_id' => 'required|exists:services,id'
        ]);

        $provider->services()->syncWithoutDetaching([$request->service_id]);

        return response()->json([
            'status' => 'success',
            'message' => 'Service added successfully',
            'data' => $provider->services
        ]);
    }

    /**
     * Detach a service from the provider.
     */
    public function destroy($id)
    {
        $provider = Auth::user();

        if (!$provider instanceof ServiceProvider) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized.'
            ], 403);
        }

        $provider->services()->detach($id);

        return response()->json([
            'status' => 'success',
            'message' => 'Service removed successfully',
            'data' => $provider->services
        ]);
    }
}
