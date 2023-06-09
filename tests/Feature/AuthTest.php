<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\DatabaseMigrations;

class AuthTest extends TestCase
{
    use DatabaseMigrations;

    public function test_user_can_view_login_page(): void
    {
        $response = $this->get('/');

        $response->assertSuccessful();
    }

    public function test_user_can_login_with_correct_credentials(): void
    {
        $user = \App\Models\User::factory()->create([
            'password' => bcrypt($password = 'password'),
        ]);

        $response = $this->post('api/login', [
            'email' => $user->email,
            'password' => $password,
        ]);

        $this->assertAuthenticated();
    }

    public function test_user_can_not_login_with_incorrect_credentials(): void
    {
        $user = \App\Models\User::factory()->create();

        $response = $this->post('api/login', [
            'email' => $user->email,
            'password' => '$password',
        ]);

        $this->assertGuest();
    }
}
