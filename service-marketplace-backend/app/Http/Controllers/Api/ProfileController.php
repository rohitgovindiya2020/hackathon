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
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
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

        // Handle profile image upload
        if ($request->hasFile('profile_image')) {
            $image = $request->file('profile_image');
            $filename = time() . '_' . $user->id . '.' . $image->getClientOriginalExtension();
            $path = $image->storeAs('profiles', $filename, 'public');
            $user->profile_image = asset('storage/' . $path);
        }

        // Update basic info (excluding address which is handled separately)
        $basicData = collect($validated)->except(['address', 'profile_image'])->toArray();
        $user->fill($basicData);
        
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
