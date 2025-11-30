<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Product */
class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $images = $this->images;
        if (is_string($images) && $images !== '') {
            $decoded = json_decode($images, true);
            $images = is_array($decoded) ? $decoded : [$images];
        }
        if (!is_array($images)) {
            $images = [];
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'price' => (int) $this->price,
            'originalPrice' => $this->original_price ? (int) $this->original_price : null,
            'discount' => $this->discount ? (int) $this->discount : 0,
            'image' => $this->image,
            'images' => array_values($images),
            'brand' => $this->brand,
            'category' => $this->category,
            'ram' => $this->ram,
            'storage' => $this->storage,
            'screen' => $this->screen,
            'camera' => $this->camera,
            'battery' => $this->battery,
            'os' => $this->os,
            'description' => $this->description,
            'isFeatured' => (bool) $this->is_featured,
            'createdAt' => $this->created_at?->toIso8601String(),
            'updatedAt' => $this->updated_at?->toIso8601String(),
        ];
    }
}


