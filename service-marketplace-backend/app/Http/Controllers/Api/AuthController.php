<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\User;
use App\Models\ServiceProvider;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user
     * POST /api/register
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:service_providers|unique:customers|unique:admins',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:customer,provider,admin',
            'phone' => 'nullable|string|max:20',
            'area_ids' => 'required_if:role,provider|array', // Required for providers
            'area_ids.*' => 'exists:service_areas,id',
        ]);

        $userData = [
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'mobile_no' => $request->phone,
        ];

        // Create user in the appropriate table
        if ($request->role === 'provider') {
            $user = ServiceProvider::create($userData);
            if ($request->has('area_ids')) {
                $user->areas()->attach($request->area_ids);
            }
            $user->load('areas');
        } elseif ($request->role === 'customer') {
            $user = Customer::create($userData);
        } else {
            $user = Admin::create($userData);
        }

        // Create API token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Try to find the user in different tables
        $user = Admin::where('email', $request->email)->first()
            ?? ServiceProvider::where('email', $request->email)->first()
            ?? Customer::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Create API token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Load relationships if they exist
        if ($user instanceof ServiceProvider) {
            $user->load('areas', 'services');
        } elseif ($user instanceof Customer) {
            $user->load('address');
        }

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function adminLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = Admin::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Create API token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    /**
     * Logout user (revoke token)
     * POST /api/logout
     */
    public function logout(Request $request)
    {
        // Revoke current token
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    /**
     * Get authenticated user
     * GET /api/user
     */
    public function me(Request $request)
    {
        $user = $request->user();

        if ($user instanceof ServiceProvider) {
            $user->load(['areas', 'services', 'media', 'address']);
        } elseif ($user instanceof Customer) {
            $user->load(['address', 'discountInterests']);
        }

        return response()->json([
            'user' => $user,
        ]);
    }

    /**
     * Get user profile details
     * GET /api/profile
     */
    public function profile(Request $request)
    {
        return $this->me($request);
    }
}
