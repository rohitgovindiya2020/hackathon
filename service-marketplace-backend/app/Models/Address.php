<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    /** @use HasFactory<\Database\Factories\AddressFactory> */
    use HasFactory;

    protected $fillable = ['country', 'state', 'city', 'area'];

    public function customers()
    {
        return $this->hasMany(Customer::class);
    }

    public function serviceProviders()
    {
        return $this->hasMany(ServiceProvider::class);
    }
}
