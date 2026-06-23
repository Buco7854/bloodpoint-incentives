interface IconProps {
  className?: string;
}

export function SkullIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2C7 2 3.5 5.4 3.5 10.2c0 2.5 1.1 4.3 2.6 5.6.5.4.9 1 .9 1.7v.9c0 .8.7 1.5 1.5 1.5h.4c.6 0 1-.4 1-1v-1c0-.4.3-.7.7-.7s.7.3.7.7v1c0 .6.4 1 1 1h1.4c.6 0 1-.4 1-1v-1c0-.4.3-.7.7-.7s.7.3.7.7v1c0 .6.4 1 1 1h.4c.8 0 1.5-.7 1.5-1.5v-.9c0-.7.4-1.3.9-1.7 1.5-1.3 2.6-3.1 2.6-5.6C20.5 5.4 17 2 12 2Zm-4 9.5A1.8 1.8 0 1 1 9.8 9.7 1.8 1.8 0 0 1 8 11.5Zm8 0a1.8 1.8 0 1 1 1.8-1.8A1.8 1.8 0 0 1 16 11.5Z" />
    </svg>
  );
}

export function SurvivorIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8Z" />
      <path d="M12 10.6c-3.6 0-6.5 2.3-6.5 5.2 0 .8.4 1.5 1.1 1.9l-.3 2.4c-.1.8.5 1.5 1.3 1.5h.9c.7 0 1.2-.5 1.3-1.1l.4-2.6c.5.1 1.1.2 1.8.2s1.3-.1 1.8-.2l.4 2.6c.1.6.6 1.1 1.3 1.1h.9c.8 0 1.4-.7 1.3-1.5l-.3-2.4c.7-.4 1.1-1.1 1.1-1.9 0-2.9-2.9-5.2-6.5-5.2Z" />
    </svg>
  );
}

export function RefreshIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
      <path d="M21 3v5h-5" />
    </svg>
  );
}

export function SearchIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function AlertIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10.3 3.7 1.8 18a2 2 0 0 0 1.7 3h16.9a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export function ChevronDownIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
