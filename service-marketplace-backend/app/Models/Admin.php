<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    /** @use HasFactory<\Database\Factories\AdminFactory> */
    use HasFactory, HasApiTokens;

    protected $fillable = ['name', 'email', 'mobile_no', 'password'];

    protected $hidden = ['password'];

    protected $appends = ['role'];

    public function getRoleAttribute()
    {
        return 'admin';
    }
}
