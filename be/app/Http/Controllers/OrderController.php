<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log; // <--- KIỂM TRA DÒNG NÀY

class OrderController extends Controller
{
    // 1. Lưu đơn hàng mới (Dành cho Checkout)
    public function store(Request $request)
    {
        try {
            // Insert vào DB
            $orderId = DB::table('orders')->insertGetId([
                'user_id'       => $request->userId,
                'customer_name' => $request->customerName,
                'phone'         => $request->phone,
                'address'       => $request->address,
                'total_amount'  => $request->totalAmount,
                'status'        => 'pending', // Mặc định chờ duyệt
                'order_items'   => $request->orderItems, // Chuỗi JSON
                'created_at'    => Carbon::now(),
            ]);

            return response()->json([
                'status' => 200,
                'message' => 'Đặt hàng thành công',
                'order_id' => $orderId
            ], 200);

        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    // 2. Lấy danh sách đơn hàng (Dành cho User xem lịch sử)
    public function index(Request $request)
    {
        $userId = $request->query('userId');
        
        if ($userId) {
            $orders = DB::table('orders')
                ->where('user_id', $userId)
                ->orderBy('created_at', 'desc')
                ->get();
            return response()->json($orders);
        }
        
        return response()->json([]);
    }

    // 3. Lấy TOÀN BỘ đơn hàng (Dành cho Admin quản lý)
    public function indexAdmin()
    {
        $orders = DB::table('orders')
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($orders);
    }

    // 4. Cập nhật trạng thái (Dành cho Admin duyệt đơn)
    public function updateStatus(Request $request, $id)
    {
        $newStatus = $request->input('status'); // 'shipping' hoặc 'cancelled'
        
        DB::table('orders')
            ->where('id', $id)
            ->update(['status' => $newStatus]);

        return response()->json(['message' => 'Cập nhật trạng thái thành công']);
    }
}