<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceProviderMedia extends Model
{
    /** @use HasFactory<\Database\Factories\ServiceProviderMediaFactory> */
    use HasFactory;

    protected $fillable = ['provider_id', 'image'];

    public function provider()
    {
        return $this->belongsTo(ServiceProvider::class, 'provider_id');
    }
}
