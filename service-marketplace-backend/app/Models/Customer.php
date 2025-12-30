<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    /** @use HasFactory<\Database\Factories\CustomerFactory> */
    use HasFactory, HasApiTokens;

    protected $fillable = ['name', 'email', 'mobile_no', 'password', 'address_id', 'profile_image', 'status'];

    protected $hidden = ['password'];

    protected $appends = ['role'];

    public function getRoleAttribute()
    {
        return 'customer';
    }

    public function address()
    {
        return $this->belongsTo(Address::class);
    }

    public function discountInterests()
    {
        return $this->hasMany(DiscountInterest::class);
    }

    public function discountClaims()
    {
        return $this->hasMany(DiscountClaim::class);
    }
}
