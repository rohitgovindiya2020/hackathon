<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PromoCode extends Model
{
    use HasFactory;

    protected $fillable = [
        'discount_id',
        'customer_id',
        'code',
        'is_used',
        'used_at',
    ];

    protected $casts = [
        'is_used' => 'boolean',
        'used_at' => 'datetime',
    ];

    /**
     * Discount this promo code belongs to
     */
    public function discount()
    {
        return $this->belongsTo(Discount::class);
    }

    /**
     * Customer who received this code
     */
    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    /**
     * Booking where this code was used
     */
    public function booking()
    {
        return $this->hasOne(ServiceBooking::class, 'promo_code_id');
    }

    /**
     * Mark promo code as used
     */
    public function markAsUsed()
    {
        $this->is_used = true;
        $this->used_at = now();
        $this->save();
    }
}
