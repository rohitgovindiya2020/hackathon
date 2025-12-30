<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Customer::with('address');

        // Handle Search
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'LIKE', "%$search%")
                  ->orWhere('email', 'LIKE', "%$search%")
                  ->orWhere('mobile_no', 'LIKE', "%$search%");
            });
        }

        // Handle Status Filter
        if ($request->has('status') && $request->status !== 'all') {
            $status = $request->status;
            if ($status === 'active') {
                $query->where('status', 1);
            } elseif ($status === 'inactive') {
                $query->where('status', 0);
            }
        }

        // Handle Pagination
        $perPage = $request->get('per_page', 10);
        $customers = $query->latest()->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $customers->items(),
            'meta' => [
                'current_page' => $customers->currentPage(),
                'last_page' => $customers->lastPage(),
                'per_page' => $customers->perPage(),
                'total' => $customers->total(),
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
            'email' => 'required|email|unique:customers,email|unique:service_providers|unique:admins',
            'mobile_no' => 'required|string|max:20',
            'profile_image' => 'nullable|string',
            'password' => 'required|string|min:8|confirmed',
            'password' => 'required|string|min:8|confirmed',
            'status' => 'required',
            'address' => 'nullable|array',
            'address.country' => 'nullable|string',
            'address.state' => 'nullable|string',
            'address.city' => 'nullable|string',
            'address.area' => 'nullable|string',

        ]);

        if (isset($validated['status'])) {
            $status = $validated['status'];
            $validated['status'] = ($status === 'active' || $status === true || $status === 1 || $status === 'true') ? 1 : 0;
        }

        $validated['password'] = Hash::make($validated['password']);

        if ($request->has('address') && !empty($request->address)) {
            $addressData = is_array($request->address) ? $request->address : ['address' => $request->address];
            $address = \App\Models\Address::create($addressData);
            $validated['address_id'] = $address->id;
        }

        $customer = Customer::create($validated);
        $customer->load('address');

        return response()->json([
            'success' => true,
            'message' => 'Customer created successfully',
            'data' => $customer
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $customer = Customer::with('address')->find($id);
        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'Customer not found'
            ], 404);
        }
        return response()->json([
            'success' => true,
            'data' => $customer
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $customer = Customer::find($id);
        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'Customer not found'
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:customers,email,' . $id . '|unique:service_providers|unique:admins',
            'mobile_no' => 'sometimes|required|string|max:20',
            'profile_image' => 'nullable|string',
            'profile_image' => 'nullable|string',
            'status' => 'sometimes',
            'status' => 'sometimes',
            'address' => 'nullable|array',
            'address.country' => 'nullable|string',
            'address.state' => 'nullable|string',
            'address.city' => 'nullable|string',
            'address.area' => 'nullable|string',

        ]);

        if (isset($validated['status'])) {
            $status = $validated['status'];
            $validated['status'] = ($status === 'active' || $status === true || $status === 1 || $status === 'true') ? 1 : 0;
        }

        if ($request->has('address')) {
             $addressData = $request->address;
             if ($customer->address) {
                 $customer->address->update($addressData);
             } else {
                 $newAddress = \App\Models\Address::create($addressData);
                 $validated['address_id'] = $newAddress->id;
             }
        }

        $customer->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Customer updated successfully',
            'data' => $customer->load('address')
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $customer = Customer::find($id);
        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'Customer not found'
            ], 404);
        }

        $customer->delete();

        return response()->json([
            'success' => true,
            'message' => 'Customer deleted successfully'
        ]);
    }
}
