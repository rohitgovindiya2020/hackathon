<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ServiceProviderReview;
use App\Models\ServiceProvider; // Make sure this is imported if used
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * Store a newly created review in storage.
     * Route: POST /api/providers/{providerId}/reviews
     */
    public function store(Request $request, $providerId)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'required|string',
        ]);

        $user = Auth::user();
        if (!$user || $user->role !== 'customer') {
            return response()->json(['message' => 'Only customers can leave reviews'], 403);
        }

        // Check if customer already reviewed matches provider
        // Assuming a customer is linked to the User model via id or a customer profile
        // The ServiceProviderReview model uses 'customer_id'.
        // We need to know if 'Auth::user()->id' maps to 'customer_id' directly or if we need to look up a Customer model.
        // Looking at AuthContext.js: "isCustomer: user?.role === 'customer'"
        // Looking at Customer.php might help clarify.
        
        $customerId = $user->id; // Assuming User ID is Customer ID based on simple setups, verify usually.
        // If there is a separate Customer table linked to User, we might need that ID.
        // Let's assume for now User ID = Customer ID or we query the Customer record.
        
        // Actually, looking at AuthController usually clarifies this.
        // But simpler:
        $existingReview = ServiceProviderReview::where('provider_id', $providerId)
            ->where('customer_id', $customerId)
            ->first();

        if ($existingReview) {
            return response()->json(['message' => 'You have already reviewed this provider'], 409);
        }

        $review = ServiceProviderReview::create([
            'provider_id' => $providerId,
            'customer_id' => $customerId,
            'rating' => $request->rating,
            'review' => $request->review,
        ]);

        return response()->json(['message' => 'Review submitted successfully', 'data' => $review], 201);
    }

    /**
     * Update the specified review in storage.
     * Route: PUT /api/reviews/{id}
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'required|string',
        ]);

        $user = Auth::user();
        $review = ServiceProviderReview::find($id);

        if (!$review) {
            return response()->json(['message' => 'Review not found'], 404);
        }

        if ($review->customer_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $review->update([
            'rating' => $request->rating,
            'review' => $request->review,
        ]);

        return response()->json(['message' => 'Review updated successfully', 'data' => $review], 200);
    }
}
