<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use App\Events\MessageSent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    /**
     * List all conversations for the authenticated user.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $conversations = Conversation::where('client_id', $user->id)
            ->orWhere('expert_id', $user->id)
            ->with(['client', 'expert', 'messages' => function($q) {
                $q->latest()->limit(1);
            }])
            ->orderByDesc('last_message_at')
            ->get();

        return response()->json($conversations);
    }

    /**
     * Get or create a conversation between a client and an expert.
     */
    public function getOrCreate(Request $request)
    {
        $request->validate([
            'peer_id' => 'required|exists:users,id',
        ]);

        $user = Auth::user();
        $peerId = $request->peer_id;

        // Determine client and expert IDs based on roles (mockup logic)
        $clientId = $user->role === 'client' ? $user->id : $peerId;
        $expertId = $user->role === 'expert' ? $user->id : $peerId;

        $conversation = Conversation::firstOrCreate(
            ['client_id' => $clientId, 'expert_id' => $expertId]
        );

        return response()->json($conversation->load(['client', 'expert']));
    }

    /**
     * Fetch messages for a specific conversation.
     */
    public function messages(Request $request, $conversationId)
    {
        $conversation = Conversation::findOrFail($conversationId);
        
        // Ensure user belongs to conversation
        if ($conversation->client_id !== Auth::id() && $conversation->expert_id !== Auth::id()) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $messages = Message::where('conversation_id', $conversationId)
            ->with('sender')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($messages);
    }

    /**
     * Send a message in a conversation.
     */
    public function send(Request $request, $conversationId)
    {
        $request->validate([
            'body' => 'required|string',
        ]);

        $conversation = Conversation::findOrFail($conversationId);
        
        if ($conversation->client_id !== Auth::id() && $conversation->expert_id !== Auth::id()) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => Auth::id(),
            'body' => $request->body,
        ]);

        $conversation->update(['last_message_at' => now()]);

        // Broadcast the message!
        broadcast(new MessageSent($message))->toOthers();

        return response()->json($message->load('sender'));
    }
}
