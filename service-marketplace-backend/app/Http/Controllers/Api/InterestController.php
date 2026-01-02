<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DiscountInterest;
use App\Models\Discount;
use Illuminate\Http\Request;

class InterestController extends Controller
{
    /**
     * Express interest in a discount (max active interests per customer as defined in settings)
     * POST /api/interests
     */
    public function store(Request $request)
    {
        $request->validate([
            'discount_id' => 'required|exists:discounts,id',
        ]);

        $user = $request->user();

        // Check if user is a customer
        if ($user->role !== 'customer') {
            return response()->json([
                'message' => 'Only customers can express interest in discounts',
            ], 403);
        }

        // Check active interests count (using correct relationship discountInterests)
        $activeInterestsCount = $user->discountInterests()
            ->whereHas('discount', function ($query) {
                $query->where('discount_end_date', '>=', now()); 
            })
            ->count();

        // Get max active interests from settings
        $maxActiveInterests = (int) (\App\Models\Setting::where('key', 'max_services_per_user')->value('value') ?? 3);

        if ($activeInterestsCount >= $maxActiveInterests) {
            return response()->json([
                'message' => "You can only have maximum $maxActiveInterests active interests at a time. Please remove one before adding another.",
                'active_interests_count' => $activeInterestsCount,
            ], 422);
        }

        // Check if discount is valid
        $discount = Discount::findOrFail($request->discount_id);

        // CHECK: If goal already reached or already active, no more interests allowed
        if ($discount->is_active || $discount->current_interest_count >= $discount->required_interest_count) {
             return response()->json([
                'message' => 'This deal has already reached its interest target and is closed for new interests.',
            ], 422);
        }
        
        // If discount period ended
        if ($discount->interest_to_date && now()->greaterThan($discount->interest_to_date)) {
             return response()->json([
                'message' => 'Interest period for this discount has ended',
            ], 422);
        }

        // Check duplicates
        $existing = DiscountInterest::where('customer_id', $user->id)
            ->where('discount_id', $request->discount_id)
            ->first();
            
        if ($existing) {
             return response()->json([
                'message' => 'You have already shown interest in this discount',
            ], 422);
        }

        // Create interest
        $interest = DiscountInterest::create([
            'customer_id' => $user->id,
            'discount_id' => $request->discount_id,
        ]);

        // Send confirmation email to customer
        try {
            \Illuminate\Support\Facades\Mail::to($user->email)
                ->send(new \App\Mail\InterestConfirmation($discount, $user));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Failed to send interest confirmation email: ' . $e->getMessage());
        }

        // Increment count
        $discount->increment('current_interest_count');
        
        // Check if we hit the target to 'activate' the deal
        $discount->refresh();
        $now = now();
        if ($discount->current_interest_count >= $discount->required_interest_count && 
            ($discount->interest_from_date && $discount->interest_to_date ? 
             $now->between($discount->interest_from_date, $discount->interest_to_date) : true)) {
            $discount->update(['is_active' => true]);

            // NEW: Generate promo codes for all interested customers now that goal is reached
            $allInterests = \App\Models\DiscountInterest::where('discount_id', $discount->id)->get();
            foreach ($allInterests as $interestRecord) {
                if (!$interestRecord->promo_code) {
                    $interestRecord->update([
                        'promo_code' => strtoupper(\Illuminate\Support\Str::random(8))
                    ]);
                }
            }

            // Notify all interested customers
            $interestedCustomers = \App\Models\DiscountInterest::where('discount_id', $discount->id)
                ->with('customer')
                ->get()
                ->pluck('customer');

            foreach ($interestedCustomers as $customer) {
                if ($customer && $customer->email) {
                    \Illuminate\Support\Facades\Mail::to($customer->email)
                        ->send(new \App\Mail\DiscountGoalReached($discount, 'customer', ['name' => $customer->name]));
                }
            }

            // Notify Provider
            if ($discount->provider && $discount->provider->email) {
                \Illuminate\Support\Facades\Mail::to($discount->provider->email)
                    ->send(new \App\Mail\DiscountGoalReached($discount, 'provider'));
            }
        }

        return response()->json([
            'message' => 'Interest registered successfully',
            'interest' => $interest->load('discount.service'),
            'active_interests_count' => $activeInterestsCount + 1,
        ], 201);
    }

    /**
     * Remove interest
     * DELETE /api/interests/{id}
     */
    public function destroy(Request $request, $id)
    {
        // Use DiscountInterest
        $interest = DiscountInterest::where('id', $id)
            ->where('customer_id', $request->user()->id)
            ->firstOrFail();
            
        $discount = $interest->discount;

        $interest->delete(); 
        
        // Decrement count? Usually yes if they leave.
        if ($discount) {
            $discount->decrement('current_interest_count');
        }

        return response()->json([
            'message' => 'Interest removed successfully',
        ]);
    }

    /**
     * Get customer's active interests
     * GET /api/my-interests
     */
    public function myInterests(Request $request)
    {
        $interests = $request->user()->discountInterests()
            ->with(['discount.service', 'discount.provider'])
            ->whereHas('discount', function ($query) {
                $query->where('is_active', 1)
                      ->where('discount_end_date', '>=', now());
            })
            ->latest()
            ->get();

        return response()->json([
            'interests' => $interests,
            'count' => $interests->count(),
        ]);
    }

    /**
     * Get customer's full interest history
     * GET /api/interest-history
     */
    public function interestHistory(Request $request)
    {
        $interests = $request->user()->discountInterests()
            ->with(['discount.service', 'discount.provider'])
            ->latest()
            ->get();

        return response()->json([
            'interests' => $interests,
            'count' => $interests->count(),
        ]);
    }
    /**
     * Get customer's active (activated) interests count
     * GET /api/my-interests/active-count
     */
    public function activeCount(Request $request)
    {
        $count = \App\Models\DiscountInterest::where('customer_id', $request->user()->id)
            ->whereHas('discount', function ($query) {
                $query->where('is_active', 1);
            })
            ->count();

        return response()->json([
            'count' => $count,
        ]);
    }
    /**
     * Get all booked slots for a specific discount
     * GET /api/discounts/{id}/booked-slots
     */
    public function getBookedSlots($id)
    {
        $bookedSlots = DiscountInterest::where('discount_id', $id)
            ->whereNotNull('booking_date')
            ->whereNotNull('booking_time')
            ->where('booking_status', '!=', 'cancelled')
            ->get(['booking_date', 'booking_time']);

        return response()->json([
            'bookedSlots' => $bookedSlots
        ]);
    }

    /**
     * Submit/Update booking for a discount
     * POST /api/interests/book
     */
    public function bookDiscount(Request $request)
    {
        $request->validate([
            'discount_id' => 'required|exists:discounts,id',
            'booking_date' => 'required|date',
            'booking_time' => 'required',
        ]);

        $user = $request->user();
        $discount = Discount::findOrFail($request->discount_id);

        // 1. Check if discount is active
        if (!$discount->is_active) {
            return response()->json(['message' => 'This discount is not yet active for booking.'], 422);
        }

        // 2. Check if user has interest in this discount
        $interest = DiscountInterest::where('customer_id', $user->id)
            ->where('discount_id', $request->discount_id)
            ->first();

        if (!$interest) {
            return response()->json(['message' => 'You must join the deal before booking.'], 422);
        }

        // 3. Check if date is within discount period
        if ($request->booking_date < $discount->discount_start_date || $request->booking_date > $discount->discount_end_date) {
            return response()->json([
                'message' => 'Booking date must be between ' . $discount->discount_start_date . ' and ' . $discount->discount_end_date
            ], 422);
        }

        // 4. Check for double booking (same discount, same date, same time)
        // We allow multiple bookings for DIFFERENT discounts at the same time (maybe?) 
        // but for the SAME discount (same provider/service slot), we block it.
        $existingBooking = DiscountInterest::where('discount_id', $request->discount_id)
            ->where('booking_date', $request->booking_date)
            ->where('booking_time', $request->booking_time)
            ->where('id', '!=', $interest->id) // Don't block self-updates
            ->where('booking_status', '!=', 'cancelled')
            ->exists();

        if ($existingBooking) {
            return response()->json(['message' => 'This time slot is already booked by another customer.'], 422);
        }

        $interest->update([
            'booking_date' => $request->booking_date,
            'booking_time' => $request->booking_time,
            'booking_status' => 'pending'
        ]);

        return response()->json([
            'message' => 'Booking request submitted successfully!',
            'interest' => $interest
        ]);
    }

    /**
     * Accept provider suggested booking slot
     * POST /api/interests/accept-suggestion
     */
    public function acceptSuggestion(Request $request)
    {
        $request->validate([
            'discount_id' => 'required|exists:discounts,id',
        ]);

        $user = $request->user();
        $interest = DiscountInterest::where('customer_id', $user->id)
            ->where('discount_id', $request->discount_id)
            ->firstOrFail();

        if (!$interest->provider_suggested_date || !$interest->provider_suggested_time) {
            return response()->json(['message' => 'No suggestion found to accept.'], 422);
        }

        $interest->update([
            'booking_date' => $interest->provider_suggested_date,
            'booking_time' => $interest->provider_suggested_time,
            'booking_status' => 'approved', // Since provider suggested it, it's pre-approved
            'provider_suggested_date' => null,
            'provider_suggested_time' => null
        ]);

        return response()->json([
            'message' => 'Suggestion accepted successfully!',
            'interest' => $interest
        ]);
    }
}
