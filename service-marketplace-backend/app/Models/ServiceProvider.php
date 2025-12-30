<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceProvider extends Model
{
    /** @use HasFactory<\Database\Factories\ServiceProviderFactory> */
    use HasFactory, HasApiTokens;

    protected $fillable = ['name', 'email', 'mobile_no', 'password', 'profile_image', 'address_id', 'service_media_id', 'status', 'description'];

    protected $hidden = ['password'];

    protected $appends = ['role', 'average_rating', 'review_count'];

    public function getRoleAttribute()
    {
        return 'provider';
    }
    
    public function getAverageRatingAttribute()
    {
        if ($this->reviews()->count() === 0) {
            return 0;
        }
        return round($this->reviews()->avg('rating'), 1);
    }

    public function getReviewCountAttribute()
    {
        return $this->reviews()->count();
    }

    public function address()
    {
        return $this->belongsTo(Address::class);
    }

    public function services()
    {
        return $this->belongsToMany(Service::class, 'service_provider_services', 'provider_id', 'service_id');
    }

    public function areas()
    {
        return $this->belongsToMany(ServiceArea::class, 'service_provider_areas');
    }

    public function media()
    {
        return $this->hasMany(ServiceProviderMedia::class, 'provider_id');
    }

    public function discounts()
    {
        return $this->hasMany(Discount::class, 'service_provider_id');
    }

    public function discountClaims()
    {
        return $this->hasMany(DiscountClaim::class, 'provider_id');
    }
    
    public function reviews()
    {
        return $this->hasMany(ServiceProviderReview::class, 'provider_id');
    }
}
