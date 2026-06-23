interface Props {
  className?: string;
}

/**
 * Stylised Bloodpoint motif (a blood drop). An original recreation in the spirit
 * of the in-game currency, not Behaviour's official asset, so the app stays
 * self-contained with no external requests.
 */
export function BloodpointIcon({ className = 'h-6 w-6' }: Props) {
  return (
    <svg viewBox="0 0 32 32" className={className} role="img" aria-label="Bloodpoints" fill="none">
      <defs>
        <radialGradient id="bp-fill" cx="38%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#ff8a8a" />
          <stop offset="42%" stopColor="#e01e2b" />
          <stop offset="100%" stopColor="#6e0a10" />
        </radialGradient>
      </defs>
      <path
        d="M16 2.5c2.6 4.2 9 11.3 9 16.4A9 9 0 1 1 7 18.9C7 13.8 13.4 6.7 16 2.5Z"
        fill="url(#bp-fill)"
        stroke="#2a0407"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path
        d="M12.4 13.4c-1.5 1.9-2.4 3.8-2.6 5.9"
        stroke="#ffd5d5"
        strokeOpacity="0.5"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12.7" cy="20.6" r="1.5" fill="#ffffff" fillOpacity="0.4" />
    </svg>
  );
}
