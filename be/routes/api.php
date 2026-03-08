<?php

use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\OrderController; // <--- NHỚ DÒNG NÀY
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => response()->json(['status' => 'ok']));

// --- PRODUCTS ---
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/featured', [ProductController::class, 'featured']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::post('/products', [ProductController::class, 'store']);
Route::put('/products/{product}', [ProductController::class, 'update']);
Route::delete('/products/{product}', [ProductController::class, 'destroy']);

// --- AUTHENTICATION ---
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

// --- REVIEWS ---
Route::get('/reviews', [ReviewController::class, 'index']);
Route::post('/reviews', [ReviewController::class, 'store']);
Route::put('/reviews/{review}', [ReviewController::class, 'update']);
Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);

// --- NEWS ---
Route::get('/news', [NewsController::class, 'index']);
Route::get('/news/{id}', [NewsController::class, 'show']);
Route::post('/news', [NewsController::class, 'store']);
Route::put('/news/{news}', [NewsController::class, 'update']);
Route::delete('/news/{news}', [NewsController::class, 'destroy']);

// ==========================================
// --- ORDERS (ĐƠN HÀNG) - PHẦN MỚI THÊM ---
// ==========================================

// 1. Khách hàng đặt hàng (POST)
Route::post('/orders', [OrderController::class, 'store']);

// 2. Khách hàng xem lịch sử đơn (GET ?userId=...)
Route::get('/orders', [OrderController::class, 'index']);

// 3. Admin lấy danh sách toàn bộ đơn
Route::get('/admin/orders', [OrderController::class, 'indexAdmin']);

// 4. Admin cập nhật trạng thái đơn (Duyệt/Hủy)
Route::put('/admin/orders/{id}/status', [OrderController::class, 'updateStatus']);


// --- ADMIN USERS ---
Route::prefix('admin')
    ->middleware('auth.api:admin')
    ->group(function () {
        Route::get('/users', [AdminUserController::class, 'index']);
        Route::patch('/users/{user}/role', [AdminUserController::class, 'updateRole']);
    });
Route::options('/{any}', function () {
    return response()->json([], 200);
})->where('any', '.*');
