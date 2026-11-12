<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\PersonalAccessToken;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    private function payload(array $override = []): array
    {
        return array_merge([
            'name' => 'Ayşe Demir',
            'email' => 'ayse@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ], $override);
    }

    public function test_register_returns_user_and_token_without_password(): void
    {
        $response = $this->postJson('/api/auth/register', $this->payload());

        $response->assertCreated()
            ->assertJsonStructure(['user' => ['id', 'name', 'email'], 'token'])
            ->assertJsonMissingPath('user.password');
        $this->assertDatabaseHas('users', ['email' => 'ayse@example.com']);
        $this->assertNotSame('password123', User::first()->password, 'Şifre hash\'lenmiş saklanmalı');
    }

    public function test_register_validates_input(): void
    {
        $this->postJson('/api/auth/register', $this->payload(['password_confirmation' => 'different']))
            ->assertUnprocessable()->assertJsonValidationErrors('password');
        $this->postJson('/api/auth/register', $this->payload(['password' => 'short', 'password_confirmation' => 'short']))
            ->assertUnprocessable()->assertJsonValidationErrors('password');
        $this->postJson('/api/auth/register', $this->payload(['email' => 'not-an-email']))
            ->assertUnprocessable()->assertJsonValidationErrors('email');
    }

    public function test_register_rejects_duplicate_email(): void
    {
        User::factory()->create(['email' => 'ayse@example.com']);

        $this->postJson('/api/auth/register', $this->payload())
            ->assertUnprocessable()->assertJsonValidationErrors('email');
    }

    public function test_login_with_valid_credentials_returns_token(): void
    {
        User::factory()->create(['email' => 'ayse@example.com', 'password' => 'password123']);

        $this->postJson('/api/auth/login', ['email' => 'ayse@example.com', 'password' => 'password123'])
            ->assertOk()->assertJsonStructure(['user', 'token']);
    }

    public function test_login_with_wrong_password_or_unknown_email_fails(): void
    {
        User::factory()->create(['email' => 'ayse@example.com', 'password' => 'password123']);

        $this->postJson('/api/auth/login', ['email' => 'ayse@example.com', 'password' => 'wrong-password'])
            ->assertUnprocessable()->assertJsonValidationErrors('email');
        $this->postJson('/api/auth/login', ['email' => 'yok@example.com', 'password' => 'password123'])
            ->assertUnprocessable()->assertJsonValidationErrors('email');
    }

    public function test_login_is_rate_limited(): void
    {
        for ($i = 0; $i < 10; $i++) {
            $this->postJson('/api/auth/login', ['email' => 'x@example.com', 'password' => 'whatever1']);
        }

        $this->postJson('/api/auth/login', ['email' => 'x@example.com', 'password' => 'whatever1'])
            ->assertStatus(429);
    }

    public function test_me_requires_authentication(): void
    {
        $this->getJson('/api/auth/me')->assertUnauthorized();
    }

    public function test_me_returns_the_authenticated_user(): void
    {
        $token = $this->postJson('/api/auth/register', $this->payload())->json('token');

        $this->withToken($token)->getJson('/api/auth/me')
            ->assertOk()->assertJsonPath('data.email', 'ayse@example.com');
    }

    public function test_logout_revokes_the_token(): void
    {
        $token = $this->postJson('/api/auth/register', $this->payload())->json('token');
        $this->assertSame(1, PersonalAccessToken::count());

        $this->withToken($token)->postJson('/api/auth/logout')->assertOk();

        $this->assertSame(0, PersonalAccessToken::count());
    }

    public function test_expired_tokens_are_rejected(): void
    {
        $token = $this->postJson('/api/auth/register', $this->payload())->json('token');
        $this->travel(config('sanctum.expiration') + 1)->minutes();
        $this->app['auth']->forgetGuards();

        $this->withToken($token)->getJson('/api/auth/me')->assertUnauthorized();
    }
}
