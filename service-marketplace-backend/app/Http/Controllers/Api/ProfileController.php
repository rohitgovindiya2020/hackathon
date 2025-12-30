<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Address;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'mobile_no' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:8|confirmed',
            'address' => 'nullable|array',
            'address.country' => 'nullable|string',
            'address.state' => 'nullable|string',
            'address.city' => 'nullable|string',
            'address.area' => 'nullable|string',
        ]);

        if ($request->filled('password')) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        // Update basic info
        $user->fill($validated);
        
        // Handle Address
        if ($request->has('address')) {
            $addressData = $request->address;
            
            if ($user->role === 'customer' || $user->role === 'provider') {
                if ($user->address) {
                    $user->address->update($addressData);
                } else {
                    $address = Address::create($addressData);
                    $user->address_id = $address->id;
                }
            }
        }

        $user->save();

        // Reload relationships
        if ($user->role === 'customer' || $user->role === 'provider') {
            $user->load('address');
        }

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }
}
