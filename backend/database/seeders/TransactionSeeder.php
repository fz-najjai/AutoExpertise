<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Transaction;
use App\Models\Appointment;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clients = User::where('role', 'client')->get();
        $experts = User::where('role', 'expert')->get();

        if ($clients->isEmpty() || $experts->isEmpty()) return;

        for ($i = 0; $i < 20; $i++) {
            $client = $clients->random();
            $expert = $experts->random();

            $appointment = Appointment::create([
                'client_id' => $client->id,
                'expert_id' => $expert->id,
                'scheduled_at' => now()->subDays(rand(0, 30)),
                'status' => 'completed',
                'reference' => 'TX-' . rand(10000, 99999),
                'vehicle_details' => 'Véhicule de Test ' . ($i + 1),
                'problem_description' => 'Contrôle technique pré-achat'
            ]);

            Transaction::create([
                'appointment_id' => $appointment->id,
                'client_id' => $client->id,
                'stripe_payment_intent' => 'pi_' . bin2hex(random_bytes(12)),
                'amount' => rand(50, 150),
                'status' => 'succeeded',
                'paid_at' => now(),
            ]);
        }
    }
}
