<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'price',
        'original_price',
        'discount',
        'image',
        'images',
        'brand',
        'category',
        'ram',
        'storage',
        'screen',
        'camera',
        'battery',
        'os',
        'description',
        'is_featured',
    ];

    protected $casts = [
        'price' => 'integer',
        'original_price' => 'integer',
        'discount' => 'integer',
        'images' => 'array',
        'is_featured' => 'boolean',
    ];
}


