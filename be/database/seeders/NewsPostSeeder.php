<?php

namespace Database\Seeders;

use App\Models\NewsPost;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class NewsPostSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        $posts = [
            [
                'title' => 'iPhone 17 Pro Max: Đánh giá chi tiết sau 1 tháng sử dụng',
                'excerpt' => 'Trải nghiệm thực tế với iPhone 17 Pro Max – những điểm mạnh và điểm cần cải thiện...',
                'image' => 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
                'content' => '<p>Khám phá các tính năng mới của iPhone 17 Pro Max, từ camera cải tiến đến thời lượng pin ấn tượng.</p>',
                'published_at' => $now->copy()->subDays(2),
            ],
            [
                'title' => 'So sánh Galaxy S25 Ultra và iPhone 17 Pro Max',
                'excerpt' => 'Cuộc chiến giữa hai flagship hàng đầu: đâu là lựa chọn tốt nhất cho bạn?',
                'image' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
                'content' => '<p>Chúng tôi so sánh chi tiết màn hình, camera, hiệu năng và hệ sinh thái giữa hai thiết bị cao cấp.</p>',
                'published_at' => $now->copy()->subDays(4),
            ],
            [
                'title' => '10 mẹo tiết kiệm pin cho điện thoại bạn nên biết',
                'excerpt' => 'Những cách đơn giản để kéo dài thời lượng pin và tối ưu hiệu suất thiết bị...',
                'image' => 'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80',
                'content' => '<p>Các mẹo bao gồm tùy chỉnh độ sáng, quản lý ứng dụng nền và sử dụng chế độ tiết kiệm pin thông minh.</p>',
                'published_at' => $now->copy()->subDays(6),
            ],
            [
                'title' => 'Chương trình thu cũ đổi mới: Trợ giá lên đến 5 triệu',
                'excerpt' => 'Cơ hội đổi điện thoại cũ lấy máy mới với giá ưu đãi đặc biệt trong tháng này...',
                'image' => 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
                'content' => '<p>Chương trình hỗ trợ thu cũ đổi mới diễn ra tại toàn bộ hệ thống với thủ tục đơn giản, nhanh chóng.</p>',
                'published_at' => $now->copy()->subDays(8),
            ],
        ];

        foreach ($posts as $post) {
            NewsPost::updateOrCreate(
                ['slug' => Str::slug($post['title'])],
                array_merge($post, ['slug' => Str::slug($post['title'])])
            );
        }
    }
}


