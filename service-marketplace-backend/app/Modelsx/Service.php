<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'provider_id',
        'name',
        'description',
        'base_price',
        'category',
        'is_active',
    ];

    protected $casts = [
        'base_price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * Provider offering this service
     */
    public function provider()
    {
        return $this->belongsTo(User::class, 'provider_id');
    }

    /**
     * Discounts for this service
     */
    public function discounts()
    {
        return $this->hasMany(Discount::class);
    }

    /**
     * Pre-service requirements
     */
    public function requirements()
    {
        return $this->hasMany(ServiceRequirement::class);
    }

    /**
     * Bookings for this service
     */
    public function bookings()
    {
        return $this->hasMany(ServiceBooking::class);
    }

    /**
     * Service reminders
     */
    public function reminders()
    {
        return $this->hasMany(ServiceReminder::class);
    }
}
