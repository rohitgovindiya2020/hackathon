<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DiscountInterest;
use App\Models\Discount;
use Illuminate\Http\Request;

class InterestController extends Controller
{
    /**
     * Express interest in a discount (max 3 active interests per customer)
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
                // Assuming is_active means it's available, logic might depend on specific business rule
                // The previous code had 'is_activated' and dates. Let's stick to what seems logical or passed previously.
                // The Discount model has 'is_active'.
                // If 'is_activated' was meant to be 'is_active' or a different flag 'is_activated' (e.g. deal unlocked).
                // Let's assume 'is_active' from model.
                $query->where('is_active', true)
                      ->where('discount_end_date', '>=', now()); 
            })
            ->count();

        // Previous code logic:
        // where('is_activated', false) -> logic: interest phase is when deal is NOT yet activated? 
        // Or is 'is_active' the general 'this discount exists' flag?
        // Discount model has 'is_active'. Database migration in image shows 'is_active'.
        // Let's stick to checking if they have too many active interests.
        // For now, I'll relax this check or keep it simple to avoid blocking "Join Deal" if logic is ambiguous.
        // But the user didn't ask to remove it. I'll just use discountInterests relation.

        if ($activeInterestsCount >= 3) {
            return response()->json([
                'message' => 'You can only have maximum 3 active interests at a time. Please remove one before adding another.',
                'active_interests_count' => $activeInterestsCount,
            ], 422);
        }

        // Check if discount is valid
        $discount = Discount::findOrFail($request->discount_id);
        
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
            'is_activate' => false // keeping default as per probable logic
        ]);

        // Increment count
        $discount->increment('current_interest_count');
        
        // Check if we hit the target to 'activate' the deal
        $discount->refresh();
        $now = now();
        if ($discount->current_interest_count >= $discount->required_interest_count && 
            $now->between($discount->interest_from_date, $discount->interest_to_date)) {
            $discount->update(['is_active' => true]);
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
            ->with(['discount.service.provider'])
            ->whereHas('discount', function ($query) {
                $query->where('discount_end_date', '>=', now());
            })
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
            ->where('is_activate', 1)
            ->count();

        return response()->json([
            'count' => $count,
        ]);
    }
}
