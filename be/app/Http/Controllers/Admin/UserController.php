<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = User::query()->orderByDesc('id');

        if ($term = $request->query('q')) {
            $needle = '%'.mb_strtolower($term).'%';
            $query->where(function ($inner) use ($needle) {
                $inner->whereRaw('LOWER(name) LIKE ?', [$needle])
                    ->orWhereRaw('LOWER(email) LIKE ?', [$needle])
                    ->orWhereRaw('LOWER(phone) LIKE ?', [$needle]);
            });
        }

        if ($role = $request->query('role')) {
            $query->whereRaw('LOWER(role) = ?', [mb_strtolower($role)]);
        }

        $page = max(1, (int) $request->query('page', 1));
        $limit = max(1, min(50, (int) $request->query('limit', 20)));

        $total = (clone $query)->count();
        $users = $query->forPage($page, $limit)->get();

        return response()->json([
            'data' => UserResource::collection($users),
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'totalPages' => (int) ceil($total / $limit),
            ],
        ]);
    }

    public function updateRole(Request $request, User $user): JsonResponse|UserResource
    {
        $data = $request->validate([
            'role' => ['required', 'string', Rule::in(['customer', 'admin'])],
        ]);

        if ($request->user()?->id === $user->id && $data['role'] !== 'admin') {
            return response()->json([
                'message' => 'Bạn không thể tự hạ quyền admin của mình.',
            ], JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        $user->role = $data['role'];
        $user->save();

        return UserResource::make($user->refresh());
    }
}


