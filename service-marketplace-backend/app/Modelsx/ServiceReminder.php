<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceReminder extends Model
{
    protected $fillable = ['customer_id', 'service_id', 'reminder_interval_months', 'last_reminded_at', 'is_active'];
    protected $casts = ['last_reminded_at' => 'datetime', 'is_active' => 'boolean'];

    public function customer() { return $this->belongsTo(User::class, 'customer_id'); }
    public function service() { return $this->belongsTo(Service::class); }
}
