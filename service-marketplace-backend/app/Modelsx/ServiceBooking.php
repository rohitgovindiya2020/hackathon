<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ServiceBooking extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_id',
        'customer_id',
        'provider_id',
        'booking_date',
        'status',
        'promo_code_id',
        'final_price',
    ];

    protected $casts = [
        'booking_date' => 'date',
        'final_price' => 'decimal:2',
    ];

    /**
     * Service being booked
     */
    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * Customer who made the booking
     */
    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    /**
     * Provider offering the service
     */
    public function provider()
    {
        return $this->belongsTo(User::class, 'provider_id');
    }

    /**
     * Promo code used (if any)
     */
    public function promoCode()
    {
        return $this->belongsTo(PromoCode::class);
    }

    /**
     * Issues reported for this booking
     */
    public function issues()
    {
        return $this->hasMany(BookingIssue::class, 'booking_id');
    }

    /**
     * Photos uploaded for this booking
     */
    public function photos()
    {
        return $this->hasMany(ServicePhoto::class, 'booking_id');
    }

    /**
     * Chat messages for this booking
     */
    public function messages()
    {
        return $this->hasMany(ChatMessage::class, 'booking_id');
    }
}
