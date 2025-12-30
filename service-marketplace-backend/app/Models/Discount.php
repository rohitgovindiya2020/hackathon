<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Discount extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_provider_id',
        'service_id',
        'discount_percentage',
        'interest_from_date',
        'interest_to_date',
        'discount_start_date',
        'discount_end_date',
        'is_active',
        'required_interest_count',
        'current_interest_count',
        'required_interest_count',
        'current_interest_count',
        'address_id',
        'description',
        'included_services',
        'current_price',
        'price_after_discount',
        'view_count',
        'banner_image'
    ];

    public function provider()
    {
        return $this->belongsTo(ServiceProvider::class, 'service_provider_id');
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function interests()
    {
        return $this->hasMany(DiscountInterest::class);
    }

    public function address()
    {
        return $this->belongsTo(\App\Models\Address::class);
    }
}
