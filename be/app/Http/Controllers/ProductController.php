<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::query()->orderByDesc('id');

        if ($brand = $request->query('brand')) {
            $query->whereRaw('LOWER(brand) = ?', [mb_strtolower($brand)]);
        }

        if ($category = $request->query('category')) {
            $query->whereRaw('LOWER(category) = ?', [mb_strtolower($category)]);
        }

        if ($search = $request->query('q')) {
            $needle = '%' . mb_strtolower($search) . '%';
            $query->where(function ($inner) use ($needle) {
                $inner->whereRaw('LOWER(name) LIKE ?', [$needle])
                    ->orWhereRaw('LOWER(brand) LIKE ?', [$needle]);
            });
        }

        $page = (int) $request->query('page', 0);
        $limit = (int) $request->query('limit', 0);

        if ($page > 0 && $limit > 0) {
            $page = max(1, $page);
            $limit = max(1, min(60, $limit));
            $total = (clone $query)->count();
            $items = $query->forPage($page, $limit)->get();

            return response()->json([
                'data' => ProductResource::collection($items),
                'pagination' => [
                    'page' => $page,
                    'limit' => $limit,
                    'total' => $total,
                    'totalPages' => (int) ceil($total / $limit),
                ],
            ]);
        }

        return response()->json(ProductResource::collection($query->get()));
    }

    public function featured(): JsonResponse
    {
        $featured = Product::query()
            ->where('is_featured', true)
            ->orderByDesc('id')
            ->take(8)
            ->get();

        if ($featured->count() < 8) {
            $fallback = Product::query()
                ->orderByDesc('id')
                ->take(8 - $featured->count())
                ->get();
            $featured = $featured->merge($fallback)->unique('id');
        }

        return response()->json(ProductResource::collection($featured)->values());
    }

    public function show(int $id): ProductResource
    {
        $product = Product::findOrFail($id);

        return ProductResource::make($product);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validatePayload($request);

        $product = Product::create(array_merge($data, [
            'slug' => $this->generateUniqueSlug($data['name']),
        ]));

        return ProductResource::make($product)
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(Request $request, Product $product): ProductResource
    {
        $data = $this->validatePayload($request, isUpdate: true);

        if (isset($data['name']) && $product->name !== $data['name']) {
            $product->slug = $this->generateUniqueSlug($data['name'], $product->id);
        }

        $product->fill($data)->save();

        return ProductResource::make($product->refresh());
    }

    public function destroy(Product $product): JsonResponse
    {
        $product->delete();

        return response()->json(['success' => true]);
    }

    protected function validatePayload(Request $request, bool $isUpdate = false): array
    {
        $rules = [
            'name' => [$isUpdate ? 'sometimes' : 'required', 'string', 'max:255'],
            'price' => [$isUpdate ? 'sometimes' : 'required', 'integer', 'min:0'],
            'originalPrice' => ['nullable', 'integer', 'min:0'],
            'discount' => ['nullable', 'integer', 'min:0', 'max:100'],
            'image' => ['nullable', 'string', 'max:1000'],
            'images' => ['nullable', 'array'],
            'images.*' => ['string'],
            'brand' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:255'],
            'ram' => ['nullable', 'string', 'max:255'],
            'storage' => ['nullable', 'string', 'max:255'],
            'screen' => ['nullable', 'string', 'max:255'],
            'camera' => ['nullable', 'string', 'max:255'],
            'battery' => ['nullable', 'string', 'max:255'],
            'os' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'isFeatured' => ['nullable', 'boolean'],
        ];

        $validated = $request->validate($rules);

        $mapped = [];

        foreach ([
            'name' => 'name',
            'price' => 'price',
            'originalPrice' => 'original_price',
            'discount' => 'discount',
            'image' => 'image',
            'images' => 'images',
            'brand' => 'brand',
            'category' => 'category',
            'ram' => 'ram',
            'storage' => 'storage',
            'screen' => 'screen',
            'camera' => 'camera',
            'battery' => 'battery',
            'os' => 'os',
            'description' => 'description',
            'isFeatured' => 'is_featured',
        ] as $key => $target) {
            if (array_key_exists($key, $validated)) {
                $value = $validated[$key];
                if ($key === 'isFeatured') {
                    $value = (bool) $value;
                } elseif (in_array($key, ['price', 'originalPrice', 'discount'], true) && $value !== null) {
                    $value = (int) $value;
                }
                $mapped[$target] = $value;
            }
        }

        if (!$isUpdate) {
            $mapped += [
                'discount' => $mapped['discount'] ?? 0,
                'images' => $mapped['images'] ?? [],
                'is_featured' => $mapped['is_featured'] ?? false,
            ];
        }

        return $mapped;
    }

    protected function generateUniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $counter = 1;

        while (
            Product::where('slug', $slug)
                ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = $base.'-'.$counter++;
        }

        return $slug;
    }
}


