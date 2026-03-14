<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Availability extends Model
{
    protected $fillable = [
        'expert_id',
        'start_time',
        'end_time',
        'is_booked',
    ];

    public function expert()
    {
        return $this->belongsTo(User::class, 'expert_id');
    }
}
