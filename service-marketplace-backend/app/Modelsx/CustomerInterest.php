<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CustomerInterest extends Model
{
    use HasFactory;

    protected $fillable = ['customer_id', 'discount_id'];

    /**
     * Customer who showed interest
     */
    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    /**
     * Discount the customer is interested in
     */
    public function discount()
    {
        return $this->belongsTo(Discount::class);
    }

    /**
     * Boot method to handle interest count updates
     */
    protected static function boot()
    {
        parent::boot();

        // Increment discount interest count when created
        static::created(function ($interest) {
            $interest->discount->incrementInterestCount();
        });

        // Decrement discount interest count when deleted
        static::deleted(function ($interest) {
            $interest->discount->decrementInterestCount();
        });
    }
}
