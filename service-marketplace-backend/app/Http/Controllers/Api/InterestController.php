<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CustomerInterest;
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

        // Check if customer already has 3 active interests
        $activeInterestsCount = $user->interests()
            ->whereHas('discount', function ($query) {
                $query->where('is_activated', false)
                      ->where('end_date', '>=', now());
            })
            ->count();

        if ($activeInterestsCount >= 3) {
            return response()->json([
                'message' => 'You can only have maximum 3 active interests at a time. Please remove one before adding another.',
                'active_interests_count' => $activeInterestsCount,
            ], 422);
        }

        // Check if discount is still accepting interests
        $discount = Discount::findOrFail($request->discount_id);
        
        if ($discount->is_activated) {
            return response()->json([
                'message' => 'This discount is already activated',
            ], 422);
        }

        if (now()->greaterThan($discount->end_date)) {
            return response()->json([
                'message' => 'Interest period for this discount has ended',
            ], 422);
        }

        // Create interest (will auto-increment count via model boot method)
        try {
            $interest = CustomerInterest::create([
                'customer_id' => $user->id,
                'discount_id' => $request->discount_id,
            ]);

            return response()->json([
                'message' => 'Interest registered successfully',
                'interest' => $interest->load('discount.service'),
                'active_interests_count' => $activeInterestsCount + 1,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'You have already shown interest in this discount',
            ], 422);
        }
    }

    /**
     * Remove interest
     * DELETE /api/interests/{id}
     */
    public function destroy(Request $request, $id)
    {
        $interest = CustomerInterest::where('id', $id)
            ->where('customer_id', $request->user()->id)
            ->firstOrFail();

        $interest->delete(); // Will auto-decrement count via model boot method

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
        $interests = $request->user()->interests()
            ->with(['discount.service.provider'])
            ->whereHas('discount', function ($query) {
                $query->where('end_date', '>=', now());
            })
            ->get();

        return response()->json([
            'interests' => $interests,
            'count' => $interests->count(),
        ]);
    }
}
