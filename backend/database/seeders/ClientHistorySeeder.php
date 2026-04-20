<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Appointment;
use App\Models\ExpertView;
use App\Models\Review;
use App\Models\ExpertProfile;
use Carbon\Carbon;

class ClientHistorySeeder extends Seeder
{
    public function run()
    {
        // 1. Find or create the client
        $client = User::where('email', 'CLIENT@gmail.com')->first();
        if (!$client) {
            $client = User::create([
                'name' => 'Client Test',
                'email' => 'CLIENT@gmail.com',
                'password' => bcrypt('password'),
                'role' => 'client',
                'city' => 'Casablanca'
            ]);
        }

        // 2. Get some experts
        $experts = User::where('role', 'expert')->where('is_validated', true)->take(3)->get();
        if ($experts->isEmpty()) return;

        // 3. Create views
        foreach ($experts as $expert) {
            ExpertView::create([
                'client_id' => $client->id,
                'expert_id' => $expert->id,
                'viewed_at' => now()->subDays(rand(1, 5))
            ]);
        }

        // 4. Create past appointments with reviews
        foreach ($experts->take(2) as $expert) {
            $apt = Appointment::create([
                'client_id' => $client->id,
                'expert_id' => $expert->id,
                'scheduled_at' => now()->subDays(10),
                'status' => 'completed',
                'vehicle_details' => 'Renault Clio 4 - 2018',
                'problem_description' => 'Bruit suspect au niveau du train avant.'
            ]);

            Review::create([
                'appointment_id' => $apt->id,
                'client_id' => $client->id,
                'expert_id' => $expert->id,
                'rating' => 5,
                'comment' => 'Excellent service, très professionnel et ponctuel !'
            ]);
            
            // Update expert rating
            $profile = ExpertProfile::where('user_id', $expert->id)->first();
            if ($profile) {
                $profile->average_rating = 5.0;
                $profile->total_reviews = 1;
                $profile->save();
            }
        }

        // 5. Create upcoming appointment
        Appointment::create([
            'client_id' => $client->id,
            'expert_id' => $experts->last()->id,
            'scheduled_at' => now()->addDays(2),
            'status' => 'pending',
            'vehicle_details' => 'Peugeot 208 - 2020',
            'problem_description' => 'Check-up complet avant achat.'
        ]);

        $this->command->info('Histortique pour CLIENT@gmail.com créé avec succès !');
    }
}
