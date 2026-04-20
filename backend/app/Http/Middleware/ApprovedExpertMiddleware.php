<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApprovedExpertMiddleware
{
    /**
     * Handle an incoming request.
     * Ensure the user is an expert and their profile is approved.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->role === 'expert') {
            $expertProfile = $user->expertProfile;
            
            if (!$expertProfile || $expertProfile->status !== 'approved') {
                return response()->json([
                    'message' => 'Action non autorisée. Votre compte expert n\'est pas encore approuvé.',
                ], 403);
            }
        }

        return $next($request);
    }
}
