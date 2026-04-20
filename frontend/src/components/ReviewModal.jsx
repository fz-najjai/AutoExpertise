import { useState } from 'react';
import { api } from '../context/AuthContext';
import { StarRating } from './StarRating';
import { X, Send, CheckCircle2, AlertCircle } from 'lucide-react';

/**
 * ReviewModal — Modal dialog letting a client leave a review
 * for a completed appointment.
 *
 * Props:
 *   appointment {object}   The completed appointment object (must have id, expert obj)
 *   onClose     {function} Called when modal should close
 *   onSuccess   {function} Called with the new review object after successful submit
 */
export default function ReviewModal({ appointment, onClose, onSuccess }) {
  const [rating,    setRating]    = useState(0);
  const [comment,   setComment]   = useState('');
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const expertName = appointment?.expert?.name ?? 'l\'expert';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Veuillez sélectionner une note entre 1 et 5 étoiles.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await api.post('/client/reviews', {
        appointment_id: appointment.id,
        rating,
        comment: comment.trim() || null,
      });

      setSubmitted(true);
      setTimeout(() => {
        onSuccess?.(data.review);
        onClose();
      }, 1800);
    } catch (err) {
      setError(err.response?.data?.message ?? 'Une erreur est survenue. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="review-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-modal="true"
      role="dialog"
      aria-labelledby="review-modal-title"
    >
      <div className="review-modal-card">

        {/* Header */}
        <div className="review-modal-header">
          <h2 id="review-modal-title" className="review-modal-title">
            Laisser un avis
          </h2>
          <button
            onClick={onClose}
            className="review-modal-close"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          /* Success state */
          <div className="review-modal-success">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <p className="text-xl font-bold text-slate-800">Merci pour votre avis !</p>
            <p className="text-slate-500 mt-2">Votre évaluation a été soumise.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="review-modal-body">

            {/* Expert info */}
            <div className="review-modal-expert">
              <div className="review-modal-avatar">
                {expertName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-slate-800">{expertName}</p>
                <p className="text-sm text-slate-500">
                  Réf. {appointment?.reference}
                </p>
              </div>
            </div>

            {/* Star selector */}
            <div className="review-modal-stars-section">
              <p className="text-sm font-semibold text-slate-600 mb-3">
                Votre note globale <span className="text-red-500">*</span>
              </p>
              <StarRating value={rating} onChange={setRating} size="lg" />
              <p className="review-modal-rating-label">
                {rating === 0 && 'Sélectionnez une note'}
                {rating === 1 && '😞 Très décevant'}
                {rating === 2 && '😐 Passable'}
                {rating === 3 && '🙂 Correct'}
                {rating === 4 && '😊 Très bien'}
                {rating === 5 && '🤩 Excellent !'}
              </p>
            </div>

            {/* Comment */}
            <div className="review-modal-comment">
              <label className="text-sm font-semibold text-slate-600 block mb-2">
                Commentaire <span className="text-slate-400 font-normal">(optionnel)</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                maxLength={1000}
                placeholder="Décrivez votre expérience avec cet expert..."
                className="review-modal-textarea"
              />
              <p className="text-right text-xs text-slate-400 mt-1">
                {comment.length} / 1000
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="review-modal-error">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="review-modal-actions">
              <button
                type="button"
                onClick={onClose}
                className="review-modal-btn-cancel"
                disabled={loading}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="review-modal-btn-submit"
                disabled={loading || rating === 0}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Envoi...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Soumettre l'avis
                  </span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
