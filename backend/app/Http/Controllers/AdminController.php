<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\User;

class AdminController extends Controller
{
    public function validateExpert(Request $request, $id)
    {
        // In a real app, we should check if the user is an admin. 
        // For simplicity, we assume the route is protected by an admin middleware.
        $expert = User::findOrFail($id);
        
        if ($expert->role !== 'expert') {
            return response()->json(['message' => 'L\'utilisateur n\'est pas un expert.'], 400);
        }

        $expert->is_validated = true;
        $expert->save();

        return response()->json(['message' => 'Expert validé avec succès.', 'expert' => $expert]);
    }
}
