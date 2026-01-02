<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Discount;
use App\Models\ServiceProvider;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\BookingApproved;
use App\Mail\SlotSuggested;

class DiscountController extends Controller
{
    /**
     * Get the logged-in provider's discounts.
     */
    public function index()
    {
        $provider = Auth::user();

        if (!$provider instanceof ServiceProvider) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized.'
            ], 403);
        }

        $discounts = Discount::with(['service', 'address'])
            ->where('service_provider_id', $provider->id)
            ->latest()
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $discounts
        ]);
    }

    /**
     * Create a new discount.
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

        $validator = Validator::make($request->all(), [
            'service_id' => 'required|exists:services,id',
            'discount_percentage' => 'required|numeric|min:0|max:100',
            'interest_from_date' => 'required|date',
            'interest_to_date' => 'required|date|after_or_equal:interest_from_date',
            'discount_start_date' => 'required|date|after_or_equal:interest_to_date',
            'discount_end_date' => 'required|date|after_or_equal:discount_start_date',
            'required_interest_count' => 'required|integer|min:1',
            'current_interest_count' => 'nullable|integer|min:0',
            // Address fields
            'country' => 'required|string',
            'state' => 'required|string',
            'city' => 'required|string',
            'area' => 'required|string',
            'description' => 'nullable|string',
            'included_services' => 'nullable|string',
            'current_price' => 'nullable|numeric|min:0',
            'banner_image' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Create Address
        $address = \App\Models\Address::create([
            'country' => $request->country,
            'state' => $request->state,
            'city' => $request->city,
            'area' => $request->area,
        ]);

        $discount = Discount::create([
            'service_provider_id' => $provider->id,
            'service_id' => $request->service_id,
            'discount_percentage' => $request->discount_percentage,
            'interest_from_date' => $request->interest_from_date,
            'interest_to_date' => $request->interest_to_date,
            'discount_start_date' => $request->discount_start_date,
            'discount_end_date' => $request->discount_end_date,
            'required_interest_count' => $request->required_interest_count,
            'current_interest_count' => $request->current_interest_count ?? 0,
            'address_id' => $address->id,
            'description' => $request->description,
            'included_services' => $request->included_services,
            'current_price' => $request->current_price,
            'price_after_discount' => $request->current_price ? ($request->current_price - ($request->current_price * $request->discount_percentage / 100)) : null,
            'banner_image' => $request->banner_image,
            'is_active' => false,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Discount created successfully',
            'data' => $discount->load('service')
        ], 201);
    }

    /**
     * Delete a discount.
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

        $discount = Discount::where('id', $id)
            ->where('service_provider_id', $provider->id)
            ->first();

        if (!$discount) {
            return response()->json([
                'status' => 'error',
                'message' => 'Discount not found or unauthorized.'
            ], 404);
        }

        $discount->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Discount deleted successfully'
        ]);
    }
    /**
     * Get public list of discounts with filters.
     */
    public function publicList(Request $request)
    {
        $query = Discount::with(['service', 'provider.address', 'address'])
            // ->where('is_active', true)
            ->whereDate('discount_end_date', '>=', now());

        $query->where(function ($q) use ($request) {
            // Filter by Discount's specific address
            $q->whereHas('address', function ($subQ) use ($request) {
                if ($request->has('country') && $request->country) {
                    $subQ->where('country', $request->country);
                }
                if ($request->has('state') && $request->state) {
                    $subQ->where('state', $request->state);
                }
                if ($request->has('city') && $request->city) {
                    $subQ->where('city', $request->city);
                }
                if ($request->has('area') && $request->area) {
                    $subQ->where('area', $request->area);
                }
            })
            // OR Filter by Provider's address (if discount has no specific address, or just in general validation)
            ->orWhereHas('provider.address', function ($subQ) use ($request) {
                if ($request->has('country') && $request->country) {
                    $subQ->where('country', $request->country);
                }
                if ($request->has('state') && $request->state) {
                    $subQ->where('state', $request->state);
                }
                if ($request->has('city') && $request->city) {
                    $subQ->where('city', $request->city);
                }
                if ($request->has('area') && $request->area) {
                    $subQ->where('area', $request->area);
                }
            });
        });

        $discounts = $query->latest()->get();

        return response()->json([
            'status' => 'success',
            'data' => $discounts
        ]);
    }
    /**
     * Get interested customers for a specific discount.
     */
    public function getInterests($id)
    {
        $provider = Auth::user();

        if (!$provider instanceof ServiceProvider) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized.'
            ], 403);
        }

        $discount = Discount::where('id', $id)
            ->where('service_provider_id', $provider->id)
            ->first();

        if (!$discount) {
            return response()->json([
                'status' => 'error',
                'message' => 'Discount not found or unauthorized.'
            ], 404);
        }

        $interests = \App\Models\DiscountInterest::with('customer')
            ->where('discount_id', $id)
            ->get()
            ->map(function ($interest) {
                return [
                    'id' => $interest->id,
                    'customer_id' => $interest->customer_id,
                    'customer_name' => $interest->customer->name,
                    'customer_email' => $interest->customer->email,
                    'customer_phone' => $interest->customer->mobile_no,
                    'interest_date' => $interest->created_at->toDateTimeString(),
                    'is_activate' => $interest->is_activate,
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => $interests
        ]);
    }

    /**
     * Get details for a specific customer interested in a discount.
     */
    public function getCustomerDetails($discountId, $customerId)
    {
        $provider = Auth::user();

        if (!$provider instanceof ServiceProvider) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized.'
            ], 403);
        }

        $interest = \App\Models\DiscountInterest::with(['customer', 'discount.service'])
            ->where('discount_id', $discountId)
            ->where('customer_id', $customerId)
            ->first();

        if (!$interest) {
            return response()->json([
                'status' => 'error',
                'message' => 'Interest record not found.'
            ], 404);
        }

        // Verify the discount belongs to this provider
        if ($interest->discount->service_provider_id !== $provider->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized access to this discount.'
            ], 403);
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'customer_name' => $interest->customer->name,
                'customer_email' => $interest->customer->email,
                'customer_phone' => $interest->customer->mobile_no,
                'interest_date' => $interest->created_at->toDateTimeString(),
                'promo_code' => $interest->promo_code,
                'is_activate' => $interest->is_activate,
                'service_name' => $interest->discount->service->name,
                'discount_percentage' => $interest->discount->discount_percentage,
                'booking_date' => $interest->booking_date,
                'booking_time' => $interest->booking_time,
                'booking_status' => $interest->booking_status,
                'provider_suggested_date' => $interest->provider_suggested_date,
                'provider_suggested_time' => $interest->provider_suggested_time,
                'discount_start_date' => $interest->discount->discount_start_date,
                'discount_end_date' => $interest->discount->discount_end_date,
            ]
        ]);
    }

    /**
     * Approve a booking slot for a specific customer.
     */
    public function approveBooking($discountId, $customerId)
    {
        $provider = Auth::user();

        if (!$provider instanceof ServiceProvider) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized.'
            ], 403);
        }

        $interest = \App\Models\DiscountInterest::where('discount_id', $discountId)
            ->where('customer_id', $customerId)
            ->first();

        if (!$interest) {
            return response()->json([
                'status' => 'error',
                'message' => 'Interest record not found.'
            ], 404);
        }

        // Verify the discount belongs to this provider
        $discount = Discount::find($discountId);
        if ($discount->service_provider_id !== $provider->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized access to this discount.'
            ], 403);
        }

        $interest->update([
            'booking_status' => 'approved'
        ]);

        // Send Email to Customer
        try {
            Mail::to($interest->customer->email)->send(new BookingApproved($interest));
        } catch (\Exception $e) {
            \Log::error('Failed to send booking approval email: ' . $e->getMessage());
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Booking approved successfully.',
            'data' => $interest
        ]);
    }

    /**
     * Suggest an alternative booking slot for a specific customer.
     */
    public function suggestAlternativeSlot(Request $request, $discountId, $customerId)
    {
        $provider = Auth::user();

        if (!$provider instanceof ServiceProvider) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'suggested_date' => 'required|date',
            'suggested_time' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $interest = \App\Models\DiscountInterest::where('discount_id', $discountId)
            ->where('customer_id', $customerId)
            ->first();

        if (!$interest) {
            return response()->json([
                'status' => 'error',
                'message' => 'Interest record not found.'
            ], 404);
        }

        // Verify the discount belongs to this provider
        $discount = Discount::find($discountId);
        if ($discount->service_provider_id !== $provider->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized access to this discount.'
            ], 403);
        }

        // Validate date is within discount range
        if ($request->suggested_date < $discount->discount_start_date || $request->suggested_date > $discount->discount_end_date) {
            return response()->json([
                'status' => 'error',
                'message' => 'Suggested date must be within the discount period (' . $discount->discount_start_date . ' to ' . $discount->discount_end_date . ').'
            ], 422);
        }

        $interest->update([
            'provider_suggested_date' => $request->suggested_date,
            'provider_suggested_time' => $request->suggested_time,
            'booking_status' => 'suggested'
        ]);

        // Send Email to Customer
        try {
            Mail::to($interest->customer->email)->send(new SlotSuggested($interest));
        } catch (\Exception $e) {
            \Log::error('Failed to send slot suggestion email: ' . $e->getMessage());
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Alternative slot suggested successfully.',
            'data' => $interest
        ]);
    }

    /**
     * Submit a promo code for a specific customer interest.
     */
    public function submitPromoCode(Request $request, $discountId, $customerId)
    {
        $provider = Auth::user();

        if (!$provider instanceof ServiceProvider) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'promo_code' => 'required|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $interest = \App\Models\DiscountInterest::where('discount_id', $discountId)
            ->where('customer_id', $customerId)
            ->first();

        if (!$interest) {
            return response()->json([
                'status' => 'error',
                'message' => 'Interest record not found.'
            ], 404);
        }

        // Verify the discount belongs to this provider
        $discount = Discount::find($discountId);
        if ($discount->service_provider_id !== $provider->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized access to this discount.'
            ], 403);
        }

        // Verify the promo code matches
        if ($interest->promo_code !== $request->promo_code) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid promo code. Please enter the correct code provided by the customer.'
            ], 422);
        }

        $interest->update([
            'booking_status' => 'claimed',
            'is_activate' => true
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Promo code verified and discount claimed successfully.',
            'data' => $interest
        ]);
    }
}
