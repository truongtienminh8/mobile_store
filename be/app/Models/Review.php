<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'user_name',
        'rating',
        'comment',
    ];

    protected $casts = [
        'product_id' => 'integer',
        'rating' => 'integer',
    ];
}


