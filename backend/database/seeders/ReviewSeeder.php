<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Review;
use App\Models\ExpertProfile;
use App\Models\Appointment;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clients = User::where('role', 'client')->get();
        $experts = User::where('role', 'expert')->get();

        if ($clients->isEmpty() || $experts->isEmpty()) return;

        $comments = [
            "Excellent expert, très minutieux dans son diagnostic.",
            "Très professionnel, m'a sauvé d'un mauvais achat.",
            "Ponctuel et pédagogue, je recommande les yeux fermés.",
            "Service correct, mais un peu de retard sur le rendez-vous.",
            "Expertise de qualité, rapport très détaillé fourni rapidement.",
            "Très bonne connaissance des modèles BMW, impressionné.",
            "Efficace et disponible, parfait pour une vérification rapide.",
            "L'expert a détecté un accident camouflé que je n'avais pas vu.",
        ];

        foreach ($experts as $expert) {
            // Create 3-7 reviews per expert
            $count = rand(3, 7);
            
            for ($i = 0; $i < $count; $i++) {
                $client = $clients->random();
                
                // Fetch an appointment or create a dummy one for the relation
                $appointment = Appointment::firstOrCreate(
                    ['client_id' => $client->id, 'expert_id' => $expert->id, 'status' => 'completed'],
                    [
                        'scheduled_at' => now()->subDays(rand(1, 30)), 
                        'reference' => 'RECAP-' . rand(1000, 9999),
                        'vehicle_details' => 'Véhicule de Test ' . rand(1, 100),
                        'problem_description' => 'Inspection de routine'
                    ]
                );

                Review::updateOrCreate(
                    ['appointment_id' => $appointment->id],
                    [
                        'client_id' => $client->id,
                        'expert_id' => $expert->id,
                        'rating' => rand(4, 5), // High ratings for best look
                        'comment' => $comments[array_rand($comments)],
                    ]
                );
            }

            // Sync Rating Cache in Profile
            $profile = $expert->expertProfile;
            if ($profile) {
                $reviews = Review::where('expert_id', $expert->id)->get();
                $profile->update([
                    'average_rating' => $reviews->avg('rating'),
                    'total_reviews' => $reviews->count(),
                ]);
            }
        }
    }
}
