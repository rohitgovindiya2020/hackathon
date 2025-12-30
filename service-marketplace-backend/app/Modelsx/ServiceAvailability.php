<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceAvailability extends Model
{
    protected $fillable = ['provider_id', 'date', 'is_available'];
    protected $casts = ['date' => 'date', 'is_available' => 'boolean'];

    public function provider() { return $this->belongsTo(User::class, 'provider_id'); }
}
