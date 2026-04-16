<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\User;

class AdminController extends Controller
{
    public function validateExpert(Request $request, $id)
    {
        $expert = User::findOrFail($id);
        
        if ($expert->role !== 'expert') {
            return response()->json(['message' => 'L\'utilisateur n\'est pas un expert.'], 400);
        }

        $expert->is_validated = true;
        $expert->save();

        return response()->json(['message' => 'Expert validé avec succès.', 'expert' => $expert]);
    }

    public function dashboardStats()
    {
        $totalClients = User::where('role', 'client')->count();
        $totalExperts = User::where('role', 'expert')->count();
        $pendingExperts = User::where('role', 'expert')->where('is_validated', false)->count();
        $totalAppointments = \App\Models\Appointment::count();

        return response()->json([
            'clients_count' => $totalClients,
            'experts_count' => $totalExperts,
            'pending_experts_count' => $pendingExperts,
            'appointments_count' => $totalAppointments,
        ]);
    }

    public function listExperts()
    {
        $experts = User::where('role', 'expert')->with('expertProfile')->get();
        return response()->json($experts);
    }

    public function listUsers()
    {
        $clients = User::where('role', 'client')->get();
        return response()->json($clients);
    }

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        if ($user->role === 'admin') {
            return response()->json(['message' => 'Impossible de supprimer un administrateur.'], 403);
        }
        $user->delete();
        return response()->json(['message' => 'Utilisateur supprimé avec succès.']);
    }
}
