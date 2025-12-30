<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    /** @use HasFactory<\Database\Factories\ServiceFactory> */
    use HasFactory;

    protected $fillable = ['name', 'image', 'is_active'];

    public function providers()
    {
        return $this->belongsToMany(ServiceProvider::class, 'service_provider_services', 'service_id', 'provider_id');
    }

    public function discountClaims()
    {
        return $this->hasMany(DiscountClaim::class);
    }
}
