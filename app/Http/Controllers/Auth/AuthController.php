<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;


class AuthController extends Controller
{
    public function user(Request $request)
    {
        return new UserResource($request->user());
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('auth_token');

            return response()->json([
                'user' => $user,
                'token' => data_get($token, 'plainTextToken'),
            ]);
        }
    }

    public function logout(Request $request)
    {
        Auth::logout();

        return response()->json('Logged out successfully', 200);
    }
}
