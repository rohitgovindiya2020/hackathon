<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Discount extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_id',
        'discount_percentage',
        'start_date',
        'end_date',
        'required_interest_count',
        'current_interest_count',
        'is_activated',
        'promo_code_prefix',
        'validity_end_date',
    ];

    protected $casts = [
        'discount_percentage' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'validity_end_date' => 'date',
        'is_activated' => 'boolean',
        'required_interest_count' => 'integer',
        'current_interest_count' => 'integer',
    ];

    /**
     * Service this discount applies to
     */
    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * Customer interests in this discount
     */
    public function interests()
    {
        return $this->hasMany(CustomerInterest::class);
    }

    /**
     * Promo codes generated for this discount
     */
    public function promoCodes()
    {
        return $this->hasMany(PromoCode::class);
    }

    /**
     * Check if discount should be activated and activate if conditions are met
     */
    public function checkAndActivate()
    {
        // Check if end date has passed and required interest count is met
        if (!$this->is_activated && 
            now()->greaterThanOrEqualTo($this->end_date) && 
            $this->current_interest_count >= $this->required_interest_count) {
            
            $this->is_activated = true;
            $this->save();

            // Generate promo codes for all interested customers
            $this->generatePromoCodes();

            return true;
        }

        return false;
    }

    /**
     * Generate unique promo codes for all interested customers
     */
    public function generatePromoCodes()
    {
        $interestedCustomers = $this->interests()->with('customer')->get();

        foreach ($interestedCustomers as $interest) {
            // Generate unique code
            $code = $this->promo_code_prefix . strtoupper(substr(md5(uniqid()), 0, 8));

            PromoCode::create([
                'discount_id' => $this->id,
                'customer_id' => $interest->customer_id,
                'code' => $code,
                'is_used' => false,
            ]);
        }
    }

    /**
     * Increment interest count
     */
    public function incrementInterestCount()
    {
        $this->increment('current_interest_count');
    }

    /**
     * Decrement interest count
     */
    public function decrementInterestCount()
    {
        $this->decrement('current_interest_count');
    }
}
