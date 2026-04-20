<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExpertProfile extends Model
{
    protected $fillable = [
        'user_id',
        'specialty',
        'price',
        'bio',
        'photo_url',
        'qualifications',
        'experience',
        'services',
        'average_rating',
        'total_reviews',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'expert_id', 'user_id');
    }

    public function documents()
    {
        return $this->hasMany(ExpertDocument::class);
    }
}
