<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, \Laravel\Sanctum\HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',      // customer, provider, or admin
        'phone',     // Contact phone number
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relationships

    /**
     * Areas where provider offers services (for providers only)
     */
    public function areas()
    {
        return $this->belongsToMany(Area::class, 'provider_areas', 'provider_id', 'area_id')
                    ->withTimestamps();
    }

    /**
     * Services offered by this provider
     */
    public function services()
    {
        return $this->hasMany(Service::class, 'provider_id');
    }

    /**
     * Certifications uploaded by provider
     */
    public function certifications()
    {
        return $this->hasMany(Certification::class, 'provider_id');
    }

    /**
     * Bookings made by customer
     */
    public function customerBookings()
    {
        return $this->hasMany(ServiceBooking::class, 'customer_id');
    }

    /**
     * Bookings received by provider
     */
    public function providerBookings()
    {
        return $this->hasMany(ServiceBooking::class, 'provider_id');
    }

    /**
     * Customer interests in discounts
     */
    /**
     * Customer interests in discounts
     */
    public function interests()
    {
        return $this->hasMany(DiscountInterest::class, 'customer_id');
    }

    /**
     * Customer interests in discounts (alias)
     */
    public function discountInterests()
    {
        return $this->hasMany(DiscountInterest::class, 'customer_id');
    }

    /**
     * Promo codes received by customer
     */
    public function promoCodes()
    {
        return $this->hasMany(PromoCode::class, 'customer_id');
    }

    /**
     * Customer preferences
     */
    public function preferences()
    {
        return $this->hasOne(CustomerPreference::class, 'customer_id');
    }

    /**
     * Provider response score
     */
    public function responseScore()
    {
        return $this->hasOne(ProviderResponseScore::class, 'provider_id');
    }

    // Scopes

    /**
     * Scope to get only providers
     */
    public function scopeProviders($query)
    {
        return $query->where('role', 'provider');
    }

    /**
     * Scope to get only customers
     */
    public function scopeCustomers($query)
    {
        return $query->where('role', 'customer');
    }

    /**
     * Scope to get only admins
     */
    public function scopeAdmins($query)
    {
        return $query->where('role', 'admin');
    }
}
