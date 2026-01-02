<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use App\Models\ServiceProvider;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{
    /**
     * Send a message
     */
    public function sendMessage(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|integer',
            'receiver_type' => 'required|in:customer,provider',
            'message' => 'required|string',
        ]);

        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Determine sender type based on the authenticated user model
        $senderType = $user instanceof ServiceProvider ? 'provider' : 'customer';

        $message = Message::create([
            'sender_id' => $user->id,
            'sender_type' => $senderType,
            'receiver_id' => $request->receiver_id,
            'receiver_type' => $request->receiver_type,
            'message' => $request->message,
            'is_read' => false,
        ]);

        return response()->json(['data' => $message], 201);
    }

    /**
     * Get messages between current user and another party
     */
    public function getMessages($partnerId, $partnerType)
    {
        $user = Auth::user();
        $senderType = $user instanceof ServiceProvider ? 'provider' : 'customer';

        $messages = Message::where(function ($query) use ($user, $senderType, $partnerId, $partnerType) {
            $query->where('sender_id', $user->id)
                  ->where('sender_type', $senderType)
                  ->where('receiver_id', $partnerId)
                  ->where('receiver_type', $partnerType);
        })->orWhere(function ($query) use ($user, $senderType, $partnerId, $partnerType) {
            $query->where('sender_id', $partnerId)
                  ->where('sender_type', $partnerType)
                  ->where('receiver_id', $user->id)
                  ->where('receiver_type', $senderType);
        })
        ->orderBy('created_at', 'asc')
        ->get();

        // Mark received messages as read
        Message::where('sender_id', $partnerId)
            ->where('sender_type', $partnerType)
            ->where('receiver_id', $user->id)
            ->where('receiver_type', $senderType)
            ->where('is_read', false)
            ->update(['is_read' => true]);


        return response()->json(['data' => $messages]);
    }

    /**
     * Get a list of conversations for the current user
     */
    public function getConversations()
    {
        $user = Auth::user();
        $myType = $user instanceof ServiceProvider ? 'provider' : 'customer';

        // Get all unique partners (sender or receiver)
        $conversations = Message::where(function($query) use ($user, $myType) {
                $query->where('sender_id', $user->id)->where('sender_type', $myType);
            })
            ->orWhere(function($query) use ($user, $myType) {
                $query->where('receiver_id', $user->id)->where('receiver_type', $myType);
            })
            ->select(DB::raw('CASE 
                WHEN sender_id = ' . $user->id . ' AND sender_type = "' . $myType . '" THEN receiver_id 
                ELSE sender_id 
            END as partner_id'),
            DB::raw('CASE 
                WHEN sender_id = ' . $user->id . ' AND sender_type = "' . $myType . '" THEN receiver_type 
                ELSE sender_type 
            END as partner_type'))
            ->distinct()
            ->get();

        $result = [];
        foreach ($conversations as $conv) {
            $partnerId = $conv->partner_id;
            $partnerType = $conv->partner_type;

            // Fetch partner details
            $partner = $partnerType === 'provider' 
                ? ServiceProvider::find($partnerId) 
                : Customer::find($partnerId);

            if (!$partner) continue;

            // Get last message
            $lastMessage = Message::where(function($q) use ($user, $myType, $partnerId, $partnerType) {
                    $q->where('sender_id', $user->id)->where('sender_type', $myType)
                      ->where('receiver_id', $partnerId)->where('receiver_type', $partnerType);
                })
                ->orWhere(function($q) use ($user, $myType, $partnerId, $partnerType) {
                    $q->where('sender_id', $partnerId)->where('sender_type', $partnerType)
                      ->where('receiver_id', $user->id)->where('receiver_type', $myType);
                })
                ->orderBy('created_at', 'desc')
                ->first();

            // Get unread count
            $unreadCount = Message::where('sender_id', $partnerId)
                ->where('sender_type', $partnerType)
                ->where('receiver_id', $user->id)
                ->where('receiver_type', $myType)
                ->where('is_read', false)
                ->count();

            $result[] = [
                'partner' => $partner,
                'last_message' => $lastMessage,
                'unread_count' => $unreadCount,
                'last_active' => $lastMessage ? $lastMessage->created_at : null
            ];
        }

        // Sort by last active
        usort($result, function($a, $b) {
            return strtotime($b['last_active']) - strtotime($a['last_active']);
        });

        return response()->json(['data' => $result]);
    }
}
