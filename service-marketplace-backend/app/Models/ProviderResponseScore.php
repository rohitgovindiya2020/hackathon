<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProviderResponseScore extends Model
{
    protected $fillable = ['provider_id', 'total_requests', 'accepted_requests', 'average_response_time_minutes', 'score'];
    protected $casts = ['score' => 'decimal:2'];
    public $timestamps = false; // Only has updated_at

    public function provider() { return $this->belongsTo(User::class, 'provider_id'); }
}
