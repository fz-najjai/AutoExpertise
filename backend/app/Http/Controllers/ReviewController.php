<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * POST /client/reviews
     * Client submits a review for a completed appointment.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'appointment_id' => 'required|integer|exists:appointments,id',
            'rating'         => 'required|integer|between:1,5',
            'comment'        => 'nullable|string|max:1000',
        ]);

        $appointment = Appointment::where('id', $data['appointment_id'])
            ->where('client_id', $request->user()->id)
            ->where('status', 'completed')
            ->firstOrFail();

        // Prevent duplicate reviews
        if ($appointment->review) {
            return response()->json(['message' => 'Vous avez déjà laissé un avis pour ce rendez-vous.'], 422);
        }

        $review = Review::create([
            'appointment_id' => $appointment->id,
            'client_id'      => $request->user()->id,
            'expert_id'      => $appointment->expert_id,
            'rating'         => $data['rating'],
            'comment'        => $data['comment'] ?? null,
            'is_visible'     => true,
        ]);

        // Recalculate and cache expert's average rating
        $this->recalculateExpertRating($appointment->expert_id);

        return response()->json([
            'message' => 'Avis soumis avec succès.',
            'review'  => $review->load('client:id,name'),
        ], 201);
    }

    /**
     * GET /client/experts/{id}/reviews
     * Public: list visible reviews for an expert.
     */
    public function forExpert($expertId)
    {
        $expert = User::where('id', $expertId)->where('role', 'expert')->firstOrFail();

        $reviews = Review::where('expert_id', $expert->id)
            ->where('is_visible', true)
            ->with('client:id,name')
            ->latest()
            ->paginate(10);

        $stats = [
            'average' => round($expert->expertProfile?->average_rating ?? 0, 2),
            'total'   => $expert->expertProfile?->total_reviews ?? 0,
            'breakdown' => Review::where('expert_id', $expert->id)
                ->selectRaw('rating, count(*) as count')
                ->groupBy('rating')
                ->pluck('count', 'rating'),
        ];

        return response()->json(compact('stats', 'reviews'));
    }

    /**
     * Recalculate and persist cached rating for an expert.
     */
    private function recalculateExpertRating(int $expertId): void
    {
        $avg   = Review::where('expert_id', $expertId)->avg('rating') ?? 0;
        $count = Review::where('expert_id', $expertId)->count();

        $profile = User::find($expertId)?->expertProfile;
        if ($profile) {
            $profile->update([
                'average_rating' => round($avg, 2),
                'total_reviews'  => $count,
            ]);
        }
    }
}
