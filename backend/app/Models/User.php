<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'role',
        'is_validated',
        'city',
        'latitude',
        'longitude',
    ];

    public function expertProfile()
    {
        return $this->hasOne(ExpertProfile::class);
    }

    public function availabilities()
    {
        return $this->hasMany(Availability::class, 'expert_id');
    }

    public function appointmentsAsClient()
    {
        return $this->hasMany(Appointment::class, 'client_id');
    }

    public function appointmentsAsExpert()
    {
        return $this->hasMany(Appointment::class, 'expert_id');
    }

    public function reviewsGiven()
    {
        return $this->hasMany(Review::class, 'client_id');
    }

    public function reviewsReceived()
    {
        return $this->hasMany(Review::class, 'expert_id');
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function favoritedByClients()
    {
        return $this->hasMany(Favorite::class, 'expert_id');
    }

    public function favoredBy()
    {
        return $this->belongsToMany(User::class, 'favorites', 'expert_id', 'user_id');
    }

    public function reportsSent()
    {
        return $this->hasMany(Report::class, 'reporter_id');
    }

    public function reportsReceived()
    {
        return $this->hasMany(Report::class, 'reported_id');
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'client_id');
    }

    public function conversations()
    {
        return $this->hasMany(Conversation::class, $this->role === 'expert' ? 'expert_id' : 'client_id');
    }

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
            'password'          => 'hashed',
            'latitude'          => 'float',
            'longitude'         => 'float',
            'is_validated'      => 'boolean',
        ];
    }
}
