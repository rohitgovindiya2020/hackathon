<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceProviderReview extends Model
{
    use HasFactory;

    protected $table = 'service_providers_reviews';

    protected $fillable = [
        'review',
        'rating',
        'provider_id',
        'customer_id'
    ];

    public function provider()
    {
        return $this->belongsTo(ServiceProvider::class, 'provider_id');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }
}
