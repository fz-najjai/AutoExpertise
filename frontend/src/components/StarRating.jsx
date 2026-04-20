/**
 * StarRating — interactive or read-only star component.
 * Props:
 *   value    {number}   Current rating (1-5)
 *   onChange {function} Callback when user selects a star (interactive mode)
 *   readOnly {boolean}  If true, renders a display-only widget
 *   size     {string}   'sm' | 'md' | 'lg'  (default 'md')
 */
export function StarRating({ value = 0, onChange, readOnly = false, size = 'md' }) {
  const sizes = { sm: 'text-base', md: 'text-xl', lg: 'text-3xl' };

  return (
    <div className="star-rating" aria-label={`Note : ${value} sur 5`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled  = star <= Math.round(value);
        const partial = !filled && star - 1 < value && value < star;

        return (
          <button
            key={star}
            type="button"
            className={[
              'star-btn',
              sizes[size],
              filled  ? 'star-filled'  : '',
              partial ? 'star-partial' : '',
              readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-125',
            ].join(' ')}
            onClick={() => !readOnly && onChange?.(star)}
            disabled={readOnly}
            aria-label={`${star} étoile${star > 1 ? 's' : ''}`}
          >
            {filled || partial ? '★' : '☆'}
          </button>
        );
      })}
    </div>
  );
}

/**
 * RatingDisplay — compact inline rating badge.
 * Shows filled star + numeric average + total count.
 */
export function RatingDisplay({ average = 0, total = 0, showCount = true }) {
  if (total === 0) {
    return (
      <span className="rating-display rating-none">
        ☆ <span className="rating-none-text">Pas encore évalué</span>
      </span>
    );
  }

  return (
    <span className="rating-display">
      <span className="rating-star">★</span>
      <span className="rating-avg">{Number(average).toFixed(1)}</span>
      {showCount && (
        <span className="rating-count">({total} avis)</span>
      )}
    </span>
  );
}
