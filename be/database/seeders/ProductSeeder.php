<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'iPhone 17 Pro Max 256GB',
                'price' => 29990000,
                'original_price' => 32990000,
                'discount' => 9,
                'image' => 'https://images.unsplash.com/photo-1510552776732-01acc9a4c7be?auto=format&fit=crop&w=900&q=80',
                'images' => [
                    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
                    'https://images.unsplash.com/photo-1512495978392-3807f3f3a5cd?auto=format&fit=crop&w=900&q=80',
                ],
                'brand' => 'apple',
                'category' => 'phone',
                'ram' => '8GB',
                'storage' => '256GB',
                'screen' => '6.9" Super Retina XDR',
                'camera' => '48MP + 12MP + 12MP',
                'battery' => '4422 mAh',
                'os' => 'iOS 18',
                'description' => '<p>iPhone 17 Pro Max với chip A19 Pro mạnh mẽ, màn hình ProMotion 120Hz cùng hệ thống camera cải tiến.</p>',
                'is_featured' => true,
            ],
            [
                'name' => 'Samsung Galaxy S25 Ultra 512GB',
                'price' => 24990000,
                'original_price' => 27990000,
                'discount' => 11,
                'image' => 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=900&q=80',
                'images' => [
                    'https://images.unsplash.com/photo-1580894897200-21d4978d9014?auto=format&fit=crop&w=900&q=80',
                ],
                'brand' => 'samsung',
                'category' => 'phone',
                'ram' => '12GB',
                'storage' => '512GB',
                'screen' => '6.8" Dynamic AMOLED 2X',
                'camera' => '200MP + 50MP + 12MP + 10MP',
                'battery' => '5000 mAh',
                'os' => 'Android 15',
                'description' => '<p>Galaxy S25 Ultra với camera 200MP, bút S Pen tích hợp và màn hình siêu sáng.</p>',
                'is_featured' => true,
            ],
            [
                'name' => 'MacBook Pro 16 M4 Max',
                'price' => 67990000,
                'original_price' => 69990000,
                'discount' => 3,
                'image' => 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=900&q=80',
                'images' => [
                    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80',
                ],
                'brand' => 'apple',
                'category' => 'laptop',
                'ram' => '32GB',
                'storage' => '1TB',
                'screen' => '16.2" Liquid Retina XDR',
                'camera' => '1080p FaceTime HD',
                'battery' => '22 giờ',
                'os' => 'macOS 15',
                'description' => '<p>MacBook Pro 16 M4 Max với hiệu năng vượt trội cho tác vụ chuyên nghiệp.</p>',
                'is_featured' => true,
            ],
            [
                'name' => 'Xiaomi Pad 7 Pro',
                'price' => 15990000,
                'original_price' => 17990000,
                'discount' => 11,
                'image' => 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
                'images' => [
                    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
                ],
                'brand' => 'xiaomi',
                'category' => 'tablet',
                'ram' => '12GB',
                'storage' => '256GB',
                'screen' => '12.4" AMOLED 144Hz',
                'camera' => '50MP + 8MP',
                'battery' => '10000 mAh',
                'os' => 'HyperOS',
                'description' => '<p>Xiaomi Pad 7 Pro đáp ứng nhu cầu làm việc và giải trí với màn hình lớn, hiệu năng cao.</p>',
                'is_featured' => true,
            ],
            [
                'name' => 'Dell XPS 15 2025',
                'price' => 48990000,
                'original_price' => 51990000,
                'discount' => 6,
                'image' => 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
                'images' => [],
                'brand' => 'dell',
                'category' => 'laptop',
                'ram' => '32GB',
                'storage' => '1TB',
                'screen' => '15.6" OLED 3.5K',
                'camera' => '1080p',
                'battery' => '86Wh',
                'os' => 'Windows 12',
                'description' => '<p>Dell XPS 15 với thiết kế viền mỏng, màn hình OLED sắc nét và hiệu năng mạnh mẽ.</p>',
                'is_featured' => false,
            ],
            [
                'name' => 'Sony WH-1000XM6',
                'price' => 9990000,
                'original_price' => 10990000,
                'discount' => 9,
                'image' => 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=80',
                'images' => [],
                'brand' => 'sony',
                'category' => 'accessories',
                'ram' => null,
                'storage' => null,
                'screen' => null,
                'camera' => null,
                'battery' => '40 giờ',
                'os' => null,
                'description' => '<p>Tai nghe chống ồn Sony thế hệ mới với chất âm đỉnh cao và thời lượng pin 40 giờ.</p>',
                'is_featured' => false,
            ],
        ];

        foreach ($products as $product) {
            Product::updateOrCreate(
                ['slug' => Str::slug($product['name'])],
                array_merge($product, ['slug' => Str::slug($product['name'])])
            );
        }
    }
}


