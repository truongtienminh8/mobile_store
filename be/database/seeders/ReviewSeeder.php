<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Review;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        $products = Product::pluck('id', 'slug');

        if ($products->isEmpty()) {
            return;
        }

        $seed = [
            [
                'product_slug' => 'iphone-17-pro-max-256gb',
                'user_name' => 'Khách A',
                'rating' => 5,
                'comment' => 'Sản phẩm rất tốt!',
            ],
            [
                'product_slug' => 'samsung-galaxy-s25-ultra-512gb',
                'user_name' => 'Khách B',
                'rating' => 4,
                'comment' => 'Ổn trong tầm giá.',
            ],
            [
                'product_slug' => 'macbook-pro-16-m4-max',
                'user_name' => 'Khách C',
                'rating' => 5,
                'comment' => 'Hiệu năng tuyệt vời cho công việc.',
            ],
        ];

        foreach ($seed as $item) {
            $productId = $products[$item['product_slug']] ?? null;
            if (!$productId) {
                continue;
            }

            Review::updateOrCreate(
                [
                    'product_id' => $productId,
                    'user_name' => $item['user_name'],
                ],
                [
                    'rating' => $item['rating'],
                    'comment' => $item['comment'],
                ]
            );
        }
    }
}


