<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingIssue extends Model
{
    protected $fillable = ['booking_id', 'issue_description', 'is_resolved', 'resolved_at'];
    protected $casts = ['is_resolved' => 'boolean', 'resolved_at' => 'datetime'];

    public function booking() { return $this->belongsTo(ServiceBooking::class, 'booking_id'); }
}
