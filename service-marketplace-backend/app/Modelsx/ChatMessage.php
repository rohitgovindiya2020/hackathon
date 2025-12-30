<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model
{
    protected $fillable = ['booking_id', 'sender_id', 'message'];

    public function booking() { return $this->belongsTo(ServiceBooking::class, 'booking_id'); }
    public function sender() { return $this->belongsTo(User::class, 'sender_id'); }
}
