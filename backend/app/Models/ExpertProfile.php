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
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
