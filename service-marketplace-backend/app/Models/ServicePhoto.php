<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServicePhoto extends Model
{
    protected $fillable = ['booking_id', 'photo_type', 'photo_path'];

    public function booking() { return $this->belongsTo(ServiceBooking::class, 'booking_id'); }
}
