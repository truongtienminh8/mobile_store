<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('allows users to login with the correct credentials', function () {
    $user = User::factory()->create([
        'email' => 'login@example.com',
        'password' => 'secret123',
    ]);

    $response = $this->postJson('/api/auth/login', [
        'email' => $user->email,
        'password' => 'secret123',
    ]);

    $response
        ->assertOk()
        ->assertJson([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
            ],
        ]);

    expect(data_get($response->json(), 'token'))->not->toBeEmpty();
});

