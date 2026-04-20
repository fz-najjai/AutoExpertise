<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class RecommendationController extends Controller
{
    /**
     * GET /recommendations?specialty=moteur&limit=10
     * Returns a scored list of validated experts sorted by composite score.
     * Factors: rating (50%) · availability (30%) · distance (20%)
     */
    public function recommend(Request $request)
    {
        $client    = $request->user();
        $specialty = trim($request->query('specialty', ''));
        $limit     = min((int) $request->query('limit', 10), 20);

        $experts = User::where('role', 'expert')
            ->where('is_validated', true)
            ->with([
                'expertProfile',
                'availabilities' => fn($q) => $q
                    ->where('start_time', '>', now())
                    ->where('is_booked', false),
            ])
            ->get();

        $scored = $experts->map(function ($expert) use ($client, $specialty) {
            $profile = $expert->expertProfile;
            if (!$profile) return null;

            // --- 1. Distance score (normalised to [0,1] over 100 km) ---
            $distKm    = $this->haversine(
                $client->latitude,  $client->longitude,
                $expert->latitude,  $expert->longitude
            );
            $distScore = max(0, 1 - ($distKm / 100));

            // --- 2. Rating score ---
            $ratingScore = ($profile->average_rating ?? 0) / 5;

            // --- 3. Specialty keyword match ---
            $specialtyScore = 0;
            if ($specialty !== '') {
                $expertSpecialty = strtolower($profile->specialty ?? '');
                $keyword         = strtolower($specialty);
                $specialtyScore  = str_contains($expertSpecialty, $keyword) ? 1 : 0;
            } else {
                $specialtyScore = 0.5; // no filter → neutral
            }

            // --- 4. Availability score (capped at 10 slots = 1.0) ---
            $slots         = $expert->availabilities->count();
            $availScore    = min($slots / 10, 1);

            $total = (0.50 * $ratingScore)
                   + (0.30 * $availScore)
                   + (0.20 * $distScore);

            return [
                'expert'          => [
                    'id'       => $expert->id,
                    'name'     => $expert->name,
                    'city'     => $expert->city,
                    'photo'    => $profile->photo_url,
                    'specialty'=> $profile->specialty,
                    'price'    => $profile->price,
                    'rating'   => $profile->average_rating,
                    'reviews'  => $profile->total_reviews,
                ],
                'score'           => round($total, 4),
                'distance_km'     => round($distKm, 1),
                'available_slots' => $slots,
                'scores_breakdown'=> [
                    'distance'    => round($distScore, 3),
                    'rating'      => round($ratingScore, 3),
                    'specialty'   => round($specialtyScore, 3),
                    'availability'=> round($availScore, 3),
                ],
            ];
        })
        ->filter()
        ->sortByDesc('score')
        ->values()
        ->take($limit);

        return response()->json($scored);
    }

    /**
     * PATCH /profile/location
     * Update the current user's geolocation coordinates.
     */
    public function updateLocation(Request $request)
    {
        $data = $request->validate([
            'latitude'  => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'city'      => 'nullable|string|max:100',
        ]);

        $request->user()->update($data);

        return response()->json(['message' => 'Localisation mise à jour.']);
    }

    /**
     * Haversine great-circle distance formula.
     * Returns distance in kilometres between two lat/lng points.
     */
    private function haversine(?float $lat1, ?float $lon1, ?float $lat2, ?float $lon2): float
    {
        // If either coordinate is missing, treat as max distance
        if ($lat1 === null || $lat2 === null || $lon1 === null || $lon2 === null) {
            return 9999;
        }

        $R    = 6371; // Earth radius in km
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);
        $a    = sin($dLat / 2) ** 2
              + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLon / 2) ** 2;

        return $R * 2 * atan2(sqrt($a), sqrt(1 - $a));
    }
}
