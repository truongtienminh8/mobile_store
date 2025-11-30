<?php

namespace App\Http\Controllers;

use App\Http\Resources\ReviewResource;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $query = Review::query()->orderByDesc('id');

        if ($request->filled('productId')) {
            $query->where('product_id', (int) $request->get('productId'));
        }

        return ReviewResource::collection($query->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'productId' => ['required', 'integer'],
            'userName' => ['required', 'string', 'max:255'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:2000'],
        ]);

        $review = Review::create([
            'product_id' => (int) $data['productId'],
            'user_name' => $data['userName'],
            'rating' => (int) $data['rating'],
            'comment' => $data['comment'] ?? '',
        ]);

        return ReviewResource::make($review)
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(Request $request, Review $review)
    {
        $data = $request->validate([
            'userName' => ['sometimes', 'string', 'max:255'],
            'rating' => ['sometimes', 'integer', 'min:1', 'max:5'],
            'comment' => ['sometimes', 'nullable', 'string', 'max:2000'],
        ]);

        $mapped = [];
        if (array_key_exists('userName', $data)) $mapped['user_name'] = $data['userName'];
        if (array_key_exists('rating', $data)) $mapped['rating'] = (int) $data['rating'];
        if (array_key_exists('comment', $data)) $mapped['comment'] = $data['comment'];

        if (!empty($mapped)) {
            $review->update($mapped);
        }

        return ReviewResource::make($review->refresh());
    }

    public function destroy(Review $review)
    {
        $review->delete();
        return response()->json(['success' => true]);
    }
}


