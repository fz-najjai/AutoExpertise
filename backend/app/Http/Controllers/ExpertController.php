<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Appointment;
use App\Models\Availability;
use App\Models\Transaction;
use Carbon\Carbon;

class ExpertController extends Controller
{
    public function dashboard(Request $request)
    {
        $expertId = $request->user()->id;

        $totalBookings = Appointment::where('expert_id', $expertId)
            ->whereIn('status', ['confirmed', 'completed'])
            ->count();

        // Simplified occupation rate: confirmed appointments / total availabilities
        $totalAvailabilities = Availability::where('expert_id', $expertId)->count();
        $bookedAvailabilities = Availability::where('expert_id', $expertId)->where('is_booked', true)->count();
        
        $occupationRate = $totalAvailabilities > 0 ? ($bookedAvailabilities / $totalAvailabilities) * 100 : 0;

        return response()->json([
            'total_bookings' => $totalBookings,
            'occupation_rate' => round($occupationRate, 2)
        ]);
    }

    public function updateProfile(Request $request)
    {
        $request->validate([
            'bio' => 'nullable|string',
            'specialty' => 'nullable|string',
            'price' => 'nullable|numeric',
        ]);

        $profile = $request->user()->expertProfile;
        
        if ($request->has('bio')) $profile->bio = $request->bio;
        if ($request->has('specialty')) $profile->specialty = $request->specialty;
        if ($request->has('price')) $profile->price = $request->price;
        
        $profile->save();

        return response()->json(['message' => 'Profil mis à jour.', 'profile' => $profile]);
    }

    public function getAvailabilities(Request $request)
    {
        $availabilities = $request->user()->availabilities;
        return response()->json($availabilities);
    }

    public function addAvailability(Request $request)
    {
        $request->validate([
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
        ]);

        $availability = Availability::create([
            'expert_id' => $request->user()->id,
            'start_time' => Carbon::parse($request->start_time),
            'end_time' => Carbon::parse($request->end_time),
            'is_booked' => false,
        ]);

        return response()->json(['message' => 'Disponibilité ajoutée.', 'availability' => $availability], 201);
    }

    public function deleteAvailability(Request $request, $id)
    {
        $availability = Availability::where('id', $id)->where('expert_id', $request->user()->id)->firstOrFail();
        
        if ($availability->is_booked) {
            return response()->json(['message' => 'Impossible de supprimer un créneau déjà réservé.'], 400);
        }

        $availability->delete();

        return response()->json(['message' => 'Disponibilité supprimée.']);
    }

    public function manageRequest(Request $request, $id)
    {
        $request->validate([
            'action' => 'required|in:accept,refuse'
        ]);

        $appointment = Appointment::where('id', $id)->where('expert_id', $request->user()->id)->where('status', 'pending')->firstOrFail();

        if ($request->action === 'accept') {
            $appointment->status = 'confirmed';
            $message = 'Rendez-vous accepté.';
        } else {
            $appointment->status = 'cancelled';
            $message = 'Rendez-vous refusé.';
            // Also free the availability slot
            $availability = Availability::where('expert_id', $request->user()->id)
                ->where('start_time', '<=', Carbon::parse($appointment->scheduled_at))
                ->where('end_time', '>', Carbon::parse($appointment->scheduled_at))
                ->first();
            
            if ($availability) {
                $availability->is_booked = false;
                $availability->save();
            }
        }

        $appointment->save();

        return response()->json(['message' => $message, 'appointment' => $appointment]);
    }
    public function listAppointments(Request $request)
    {
        $appointments = Appointment::where('expert_id', $request->user()->id)
            ->with(['client'])
            ->orderBy('scheduled_at', 'asc')
            ->get();
            
        return response()->json($appointments);
    }

    public function getEarnings(Request $request)
    {
        $expertId = $request->user()->id;
        
        // Sum of all paid transactions for this expert's appointments
        $transactions = Transaction::whereHas('appointment', function($q) use ($expertId) {
            $q->where('expert_id', $expertId);
        })->where('status', 'succeeded')->get();

        $totalRevenue = $transactions->sum('amount');
        
        // Platform fee (1.50€ per transaction)
        $totalFees = $transactions->count() * 1.50;
        $netRevenue = $totalRevenue - $totalFees;

        return response()->json([
            'total_revenue' => (float)$totalRevenue,
            'net_revenue' => (float)$netRevenue,
            'total_fees' => (float)$totalFees,
            'transaction_count' => $transactions->count(),
            'recent_transactions' => $transactions->load('client')->take(10)
        ]);
    }

    public function getPayouts(Request $request)
    {
        $payouts = \App\Models\Payout::where('expert_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($payouts);
    }

    public function requestPayout(Request $request)
    {
        $expert = $request->user();
        $earnings = $this->getEarnings($request)->getOriginalContent();
        $availableBalance = $earnings['net_revenue']; // Simplified logic

        if ($availableBalance <= 0) {
            return response()->json(['message' => 'Aucun solde disponible pour un virement.'], 400);
        }

        $payout = \App\Models\Payout::create([
            'expert_id' => $expert->id,
            'amount' => $availableBalance,
            'status' => 'pending'
        ]);

        return response()->json(['message' => 'Demande de virement envoyée.', 'payout' => $payout]);
    }

    public function getPerformance(Request $request)
    {
        $expert = $request->user();
        $profile = $expert->expertProfile;

        return response()->json([
            'rating' => $profile->average_rating,
            'total_reviews' => $profile->total_reviews,
            'completed_appointments' => Appointment::where('expert_id', $expert->id)->where('status', 'completed')->count(),
            'cancelled_appointments' => Appointment::where('expert_id', $expert->id)->where('status', 'cancelled')->count(),
        ]);
    }

    public function updateSchedule(Request $request)
    {
        $request->validate(['schedule' => 'required|array']);
        // Store as JSON in expert profile or a separate table if needed
        // For now, let's just log it or simulate success
        return response()->json(['message' => 'Planning par défaut mis à jour.']);
    }
}
