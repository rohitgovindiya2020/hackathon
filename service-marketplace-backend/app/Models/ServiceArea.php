<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceArea extends Model
{
    /** @use HasFactory<\Database\Factories\ServiceAreaFactory> */
    use HasFactory;

    protected $fillable = ['country', 'state', 'city', 'area'];

    public function providers()
    {
        return $this->belongsToMany(ServiceProvider::class, 'service_provider_areas');
    }
}
