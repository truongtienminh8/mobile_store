<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateApiToken
{
    /**
     * Handle an incoming request.
     *
     * @param  array<int, string>  $roles
     */
    public function handle(Request $request, Closure $next, ...$roles): JsonResponse|\Illuminate\Http\Response|Response
    {
        $token = $request->bearerToken() ?? $request->header('X-API-TOKEN');

        if (!$token) {
            return response()->json([
                'message' => 'Bạn cần đăng nhập để tiếp tục.',
            ], Response::HTTP_UNAUTHORIZED);
        }

        $user = User::where('api_token', $token)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Phiên làm việc không hợp lệ.',
            ], Response::HTTP_UNAUTHORIZED);
        }

        $request->setUserResolver(static fn () => $user);

        if (!empty($roles) && !in_array($user->role, $roles, true)) {
            return response()->json([
                'message' => 'Bạn không có quyền truy cập chức năng này.',
            ], Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}


