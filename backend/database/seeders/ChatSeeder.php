<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Conversation;
use App\Models\Message;

class ChatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clients = User::where('role', 'client')->get();
        $experts = User::where('role', 'expert')->get();

        if ($clients->isEmpty() || $experts->isEmpty()) return;

        foreach ($experts as $expert) {
            // Create a conversation with 2 random clients
            $selectedClients = $clients->random(min(2, $clients->count()));

            foreach ($selectedClients as $client) {
                $conversation = Conversation::firstOrCreate([
                    'client_id' => $client->id,
                    'expert_id' => $expert->id,
                ], [
                    'last_message_at' => now(),
                ]);

                // Add 3-5 messages
                $messages = [
                    ['sender_id' => $client->id, 'body' => "Bonjour, j'aimerais avoir plus de détails sur votre service d'inspection."],
                    ['sender_id' => $expert->id, 'body' => "Bonjour ! Bien sûr, je vérifie plus de 150 points de contrôle sur le véhicule."],
                    ['sender_id' => $client->id, 'body' => "Est-ce que vous regardez aussi l'état de la courroie de distribution ?"],
                    ['sender_id' => $expert->id, 'body' => "Tout à fait, c'est inclus dans le diagnostic moteur."],
                ];

                foreach ($messages as $msgData) {
                    Message::create([
                        'conversation_id' => $conversation->id,
                        'sender_id' => $msgData['sender_id'],
                        'body' => $msgData['body'],
                        'created_at' => now()->subMinutes(rand(5, 60)),
                    ]);
                }
            }
        }
    }
}
