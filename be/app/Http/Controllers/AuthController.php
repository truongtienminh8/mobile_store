<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'phone' => ['nullable', 'string', 'max:30'],
            'gender' => ['nullable', 'string', 'max:20'],
            'age' => ['nullable', 'integer', 'min:0', 'max:120'],
            'address' => ['nullable', 'string', 'max:255'],
        ]);

        $user = User::create($data);
        $token = $this->issueToken($user);

        return response()->json([
            'success' => true,
            'user' => UserResource::make($user),
            'token' => $token,
            'message' => 'Đăng ký thành công',
        ], Response::HTTP_CREATED);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Email hoặc mật khẩu không đúng',
            ], Response::HTTP_UNAUTHORIZED);
        }

        $token = $this->issueToken($user);

        return response()->json([
            'success' => true,
            'user' => UserResource::make($user->fresh()),
            'token' => $token,
        ]);
    }

    protected function issueToken(User $user): string
    {
        do {
            $token = Str::random(60);
        } while (User::where('api_token', $token)->exists());

        $user->forceFill(['api_token' => $token])->save();

        return $token;
    }
}


