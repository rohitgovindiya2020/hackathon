<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerPreference extends Model
{
    protected $fillable = ['customer_id', 'preferred_time', 'preferred_provider_id', 'communication_preference'];

    public function customer() { return $this->belongsTo(User::class, 'customer_id'); }
    public function preferredProvider() { return $this->belongsTo(User::class, 'preferred_provider_id'); }
}
