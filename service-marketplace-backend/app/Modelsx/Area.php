<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Area extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'parent_id', 'city_id'];

    /**
     * Parent area (for hierarchical structure)
     */
    public function parent()
    {
        return $this->belongsTo(Area::class, 'parent_id');
    }

    /**
     * Child areas
     */
    public function children()
    {
        return $this->hasMany(Area::class, 'parent_id');
    }

    /**
     * City this area belongs to
     */
    public function city()
    {
        return $this->belongsTo(City::class);
    }

    /**
     * Providers serving this area
     */
    public function providers()
    {
        return $this->belongsToMany(User::class, 'provider_areas', 'area_id', 'provider_id')
                    ->withTimestamps();
    }
}
