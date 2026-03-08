<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Những trường được phép gán dữ liệu hàng loạt (Mass Assignment).
     * Phải có đủ các trường bạn dùng bên Controller.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'gender',
        'age',
        'address',
        'api_token', // Thêm trường này nếu muốn gán trực tiếp (tùy chọn)
    ];

    /**
     * Những trường bị ẩn đi khi trả về JSON (response).
     */
    protected $hidden = [
        'password',
        'remember_token',
        'api_token', // Thường ẩn token trong object User trả về để bảo mật
    ];

    /**
     * Ép kiểu dữ liệu.
     * QUAN TRỌNG: Đã XÓA dòng 'password' => 'hashed' để dùng text thường.
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        // 'password' => 'hashed', // <-- Dòng này đã bị xóa/comment để tắt mã hóa
    ];
}