<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\ExpertProfile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        file_put_contents(__DIR__ . '/../../../storage/logs/auth_debug.log', date('Y-m-d H:i:s') . " - Register started\n", FILE_APPEND);
        
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:8',
            'role' => 'required|in:client,expert',
            'city' => 'required|string|max:255',
        ]);

        return DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
                'city' => $request->city,
                'is_validated' => true,
            ]);

            if ($user->role === 'expert') {
                ExpertProfile::create([
                    'user_id' => $user->id,
                    'specialty' => 'Non spécifié',
                    'price' => 0,
                    'bio' => '',
                ]);
            }

            file_put_contents(__DIR__ . '/../../../storage/logs/auth_debug.log', date('Y-m-d H:i:s') . " - User created ID: " . $user->id . "\n", FILE_APPEND);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'user' => $user->load('expertProfile'),
                'access_token' => $token,
                'token_type' => 'Bearer',
            ], 201);
        });
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants fournis sont incorrects.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user->load('expertProfile'),
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie'
        ]);
    }
}
