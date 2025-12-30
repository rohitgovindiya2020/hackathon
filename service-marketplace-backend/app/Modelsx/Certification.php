<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Certification extends Model
{
    protected $fillable = ['provider_id', 'title', 'document_path', 'is_verified', 'verified_by', 'verified_at'];
    protected $casts = ['is_verified' => 'boolean', 'verified_at' => 'datetime'];

    public function provider() { return $this->belongsTo(User::class, 'provider_id'); }
    public function verifier() { return $this->belongsTo(User::class, 'verified_by'); }
}
