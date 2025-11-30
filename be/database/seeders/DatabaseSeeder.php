<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            ProductSeeder::class,
            NewsPostSeeder::class,
        ]);

        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Quản trị viên',
                'password' => 'admin123',
                'phone' => '0900000000',
                'gender' => 'Nam',
                'age' => 30,
                'address' => 'Hà Nội',
                'role' => 'admin',
                'api_token' => Str::random(60),
            ]
        );

        User::updateOrCreate(
            ['email' => 'user@example.com'],
            [
                'name' => 'Khách hàng',
                'password' => 'user123456',
                'phone' => '0911111111',
                'gender' => 'Nữ',
                'age' => 25,
                'address' => 'TP. Hồ Chí Minh',
                'role' => 'customer',
                'api_token' => Str::random(60),
            ]
        );

        $this->call([
            ReviewSeeder::class,
        ]);
    }
}
