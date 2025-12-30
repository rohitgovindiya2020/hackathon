<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiscountInterest extends Model
{
    use HasFactory;

    protected $fillable = ['customer_id', 'discount_id', 'is_activate'];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function discount()
    {
        return $this->belongsTo(Discount::class);
    }
}
