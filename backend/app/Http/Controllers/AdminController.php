<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\User;
use App\Models\Appointment;
use App\Models\Review;
use App\Models\Report;
use App\Models\Setting;

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
        
        if ($expert->expertProfile) {
            $expert->expertProfile->status = 'approved';
            $expert->expertProfile->save();
        }

        return response()->json(['message' => 'Expert validé avec succès.', 'expert' => $expert]);
    }

    public function approveExpert($id)
    {
        $expert = User::findOrFail($id);
        
        if ($expert->role !== 'expert') {
            return response()->json(['message' => 'L\'utilisateur n\'est pas un expert.'], 400);
        }

        $expertProfile = $expert->expertProfile;
        if($expertProfile) {
            $expertProfile->status = 'approved';
            $expertProfile->save();
        }
        
        $expert->is_validated = true;
        $expert->save();

        return response()->json(['message' => 'Expert approuvé avec succès.', 'expert' => $expert->load('expertProfile')]);
    }

    public function rejectExpert($id)
    {
        $expert = User::findOrFail($id);
        
        if ($expert->role !== 'expert') {
            return response()->json(['message' => 'L\'utilisateur n\'est pas un expert.'], 400);
        }

        $expertProfile = $expert->expertProfile;
        if($expertProfile) {
            $expertProfile->status = 'rejected';
            $expertProfile->save();
        }
        
        $expert->is_validated = false;
        $expert->save();

        return response()->json(['message' => 'Expert rejeté.', 'expert' => $expert->load('expertProfile')]);
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

    public function listExperts(Request $request)
    {
        $query = User::where('role', 'expert')->with('expertProfile');
        
        if ($request->has('status')) {
            $query->whereHas('expertProfile', function($q) use ($request) {
                $q->where('status', $request->status);
            });
        }
        
        return response()->json($query->get());
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

    /**
     * GET /admin/analytics
     * Returns full platform KPIs for the admin dashboard.
     */
    public function analytics()
    {
        // --- User stats ---
        $userStats = [
            'total'           => User::count(),
            'clients'         => User::where('role', 'client')->count(),
            'experts'         => User::where('role', 'expert')->count(),
            'pending_experts' => User::where('role', 'expert')->where('is_validated', false)->count(),
            'admins'          => User::where('role', 'admin')->count(),
            'new_this_month'  => User::whereMonth('created_at', now()->month)
                                     ->whereYear('created_at', now()->year)->count(),
        ];

        // --- Appointment stats ---
        $apptStats = [
            'total'     => Appointment::count(),
            'pending'   => Appointment::where('status', 'pending')->count(),
            'confirmed' => Appointment::where('status', 'confirmed')->count(),
            'completed' => Appointment::where('status', 'completed')->count(),
            'cancelled' => Appointment::where('status', 'cancelled')->count(),
            'monthly'   => Appointment::selectRaw("strftime('%Y-%m', created_at) as month, count(*) as total")
                ->groupBy('month')
                ->orderBy('month')
                ->get(),
        ];

        // --- Review stats ---
        $reviewStats = [
            'total'          => Review::count(),
            'average_rating' => round(Review::avg('rating') ?? 0, 2),
        ];

        // --- Top 5 experts by completed appointments ---
        $topExperts = User::where('role', 'expert')
            ->where('is_validated', true)
            ->with('expertProfile:user_id,specialty,average_rating,total_reviews')
            ->withCount([
                'appointmentsAsExpert as completed_count' => fn($q) =>
                    $q->where('status', 'completed'),
            ])
            ->orderByDesc('completed_count')
            ->limit(5)
            ->get(['id', 'name', 'city'])
            ->map(fn($e) => [
                'id'            => $e->id,
                'name'          => $e->name,
                'city'          => $e->city,
                'specialty'     => $e->expertProfile?->specialty,
                'rating'        => $e->expertProfile?->average_rating,
                'completed'     => $e->completed_count,
            ]);

        return response()->json([
            'users'       => $userStats,
            'appointments'=> $apptStats,
            'reviews'     => $reviewStats,
            'top_experts' => $topExperts,
        ]);
    }

    public function listReports()
    {
        $reports = Report::with(['reporter', 'reported'])->orderBy('created_at', 'desc')->get();
        return response()->json($reports);
    }

    public function processReport(Request $request, $id)
    {
        $request->validate(['status' => 'required|in:resolved,dismissed']);
        $report = Report::findOrFail($id);
        $report->status = $request->status;
        $report->save();

        return response()->json(['message' => 'Signalement traité.', 'report' => $report]);
    }

    public function listSettings()
    {
        $settings = Setting::all();
        return response()->json($settings);
    }

    public function updateSetting(Request $request, $id)
    {
        $request->validate(['value' => 'required']);
        $setting = Setting::findOrFail($id);
        $setting->value = $request->value;
        $setting->save();

        return response()->json(['message' => 'Paramètre mis à jour.', 'setting' => $setting]);
    }

    public function ledger()
    {
        $transactions = \App\Models\Transaction::with(['client', 'appointment.expert'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $totalVolume = \App\Models\Transaction::where('status', 'succeeded')->sum('amount');
        $totalFees = \App\Models\Transaction::where('status', 'succeeded')->count() * 1.50; // Mock fee calculation

        return response()->json([
            'transactions' => $transactions,
            'stats' => [
                'total_volume' => $totalVolume,
                'total_fees' => $totalFees,
                'transaction_count' => \App\Models\Transaction::count(),
            ]
        ]);
    }

    public function systemLogs()
    {
        $logs = \App\Models\ActivityLog::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(50);
        return response()->json($logs);
    }

    public function trustSafety()
    {
        $activeReports = Report::where('status', 'pending')->count();
        $verifiedExperts = User::where('role', 'expert')->where('is_validated', true)->count();
        $totalConversations = \App\Models\Conversation::count();

        return response()->json([
            'stats' => [
                ['title' => 'Signalements actifs', 'value' => $activeReports, 'icon' => 'ShieldAlert'],
                ['title' => 'Utilisateurs vérifiés', 'value' => $verifiedExperts, 'icon' => 'Users'],
                ['title' => 'Conversations modérées', 'value' => $totalConversations, 'icon' => 'MessageCircle'],
            ],
            'recent_reports' => Report::with(['reporter', 'reported'])->latest()->take(5)->get()
        ]);
    }
}

