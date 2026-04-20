<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    protected $fillable = [
        'reference',
        'client_id',
        'expert_id',
        'scheduled_at',
        'vehicle_details',
        'problem_description',
        'status',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($appointment) {
            $appointment->reference = 'REF-' . strtoupper(bin2hex(random_bytes(3)));
        });
    }

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function expert()
    {
        return $this->belongsTo(User::class, 'expert_id');
    }

    public function review()
    {
        return $this->hasOne(Review::class);
    }

    public function transaction()
    {
        return $this->hasOne(Transaction::class);
    }
}

