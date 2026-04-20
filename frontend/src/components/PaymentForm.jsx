import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { api } from '../context/AuthContext';
import { CreditCard, Lock, ShieldCheck, AlertCircle } from 'lucide-react';

export default function PaymentForm({ appointment, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Create PaymentIntent on the server
      const { data } = await api.post('/client/payments/intent', {
        appointment_id: appointment.id
      });

      const { clientSecret } = data;

      // 2. Confirm payment on the client
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: appointment.client?.name || 'Client',
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
        setLoading(false);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          // 3. Notify server of success
          await api.post('/client/payments/confirm', {
            payment_intent: result.paymentIntent.id
          });
          onSuccess();
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue lors de l'initialisation du paiement.");
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#0f172a',
        fontFamily: 'Outfit, sans-serif',
        '::placeholder': {
          color: '#94a3b8',
        },
      },
      invalid: {
        color: '#ef4444',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-up">
      <div className="space-y-4">
        <label className="text-sm font-bold text-slate-900 ml-2 flex items-center gap-2">
          <CreditCard className="w-4 h-4" /> Détails de la carte
        </label>
        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 focus-within:ring-2 focus-within:ring-slate-900/5 transition-all">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {error && (
        <div className="p-5 bg-red-50 border border-red-100 rounded-3xl flex items-center gap-4 text-red-600 font-bold text-sm">
          <AlertCircle className="w-6 h-6 shrink-0" />
          {error}
        </div>
      )}

      <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100 flex items-start gap-4">
        <ShieldCheck className="w-6 h-6 text-indigo-500 shrink-0" />
        <div className="space-y-1">
          <p className="text-sm font-bold text-indigo-900">Paiement 100% Sécurisé</p>
          <p className="text-xs text-indigo-600/80 leading-relaxed text-indigo-600 font-medium">
            Vos informations de carte sont cryptées et traitées directement par Stripe. AutoExpertise ne stocke aucune donnée bancaire.
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full btn-primary py-5 rounded-[28px] shadow-2xl shadow-slate-900/20 flex items-center justify-center gap-3 group relative overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Traitement sécurisé...
          </div>
        ) : (
          <>
            <Lock className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Confirmer le paiement ({appointment.expert?.expert_profile?.price}€)
          </>
        )}
      </button>

      <div className="flex justify-center items-center gap-6 opacity-40 grayscale group-hover:grayscale-0 transition-all">
         <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
         <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
         <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-6" />
      </div>
    </form>
  );
}
