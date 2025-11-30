<?php

namespace App\Http\Controllers;

use App\Http\Resources\NewsPostResource;
use App\Models\NewsPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class NewsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = NewsPost::query()
            ->orderByDesc('published_at')
            ->orderByDesc('created_at');

        $page = max(1, (int) $request->query('page', 1));
        $limit = max(1, min(20, (int) $request->query('limit', 6)));
        $total = (clone $query)->count();
        $items = $query->forPage($page, $limit)->get();

        return response()->json([
            'data' => NewsPostResource::collection($items),
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'totalPages' => (int) ceil($total / $limit),
            ],
        ]);
    }

    public function show(int $id): NewsPostResource
    {
        $post = NewsPost::findOrFail($id);

        return NewsPostResource::make($post);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validatePayload($request);

        $post = NewsPost::create(array_merge($data, [
            'slug' => $this->generateUniqueSlug($data['title']),
        ]));

        return NewsPostResource::make($post)
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(Request $request, NewsPost $news): NewsPostResource
    {
        $data = $this->validatePayload($request, isUpdate: true);

        if (isset($data['title']) && $news->title !== $data['title']) {
            $news->slug = $this->generateUniqueSlug($data['title'], $news->id);
        }

        $news->fill($data)->save();

        return NewsPostResource::make($news->refresh());
    }

    public function destroy(NewsPost $news): JsonResponse
    {
        $news->delete();

        return response()->json(['success' => true]);
    }

    protected function validatePayload(Request $request, bool $isUpdate = false): array
    {
        $validated = $request->validate([
            'title' => [$isUpdate ? 'sometimes' : 'required', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string', 'max:512'],
            'image' => ['nullable', 'string', 'max:1000'],
            'content' => ['nullable', 'string'],
            'publishedAt' => ['nullable', 'date'],
        ]);

        $mapped = [];

        foreach ([
            'title' => 'title',
            'excerpt' => 'excerpt',
            'image' => 'image',
            'content' => 'content',
        ] as $key => $target) {
            if (array_key_exists($key, $validated)) {
                $mapped[$target] = $validated[$key];
            }
        }

        if (array_key_exists('publishedAt', $validated)) {
            $mapped['published_at'] = $validated['publishedAt']
                ? Carbon::parse($validated['publishedAt'])
                : null;
        }

        return $mapped;
    }

    protected function generateUniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title);
        $slug = $base;
        $counter = 1;

        while (
            NewsPost::where('slug', $slug)
                ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = $base.'-'.$counter++;
        }

        return $slug;
    }
}


