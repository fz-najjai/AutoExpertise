<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    /**
     * Create a Stripe PaymentIntent for a pending appointment.
     */
    public function createIntent(Request $request)
    {
        $request->validate([
            'appointment_id' => 'required|exists:appointments,id',
        ]);

        $appointment = Appointment::with('expert.expertProfile')->findOrFail($request->appointment_id);
        
        // Safety check: only pending or confirmed appointments can be paid
        if ($appointment->status === 'cancelled' || $appointment->status === 'completed') {
            return response()->json(['message' => 'Cette réservation ne peut plus être payée.'], 400);
        }

        $amount = $appointment->expert->expertProfile->price * 100; // Stripe uses cents

        try {
            $intent = PaymentIntent::create([
                'amount' => $amount,
                'currency' => 'eur',
                'metadata' => [
                    'appointment_id' => $appointment->id,
                    'reference' => $appointment->reference,
                    'client_id' => $request->user()->id,
                ],
            ]);

            // Save or update transaction record
            Transaction::updateOrCreate(
                ['appointment_id' => $appointment->id],
                [
                    'client_id' => $request->user()->id,
                    'stripe_payment_intent' => $intent->id,
                    'amount' => $appointment->expert->expertProfile->price,
                    'currency' => 'EUR',
                    'status' => 'pending',
                ]
            );

            return response()->json([
                'clientSecret' => $intent->client_secret,
                'amount' => $amount,
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur Stripe: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Verify payment status after frontend success.
     */
    public function confirmPayment(Request $request)
    {
        $request->validate([
            'payment_intent' => 'required|string',
        ]);

        try {
            $intent = PaymentIntent::retrieve($request->payment_intent);
            
            if ($intent->status === 'succeeded') {
                $transaction = Transaction::where('stripe_payment_intent', $intent->id)->firstOrFail();
                
                DB::transaction(function () use ($transaction) {
                    $transaction->update([
                        'status' => 'succeeded',
                        'paid_at' => now(),
                    ]);

                    // Optionally update appointment status if logic requires "paid" status
                    // $transaction->appointment->update(['status' => 'confirmed']);
                });

                return response()->json(['message' => 'Paiement confirmé avec succès.', 'status' => 'succeeded']);
            }

            return response()->json(['message' => 'Le paiement n\'a pas encore abouti.', 'status' => $intent->status]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}
