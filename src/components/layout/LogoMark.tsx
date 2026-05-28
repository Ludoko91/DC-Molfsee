export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      width="28"
      height="32"
      viewBox="0 0 28 32"
      className={className}
      aria-hidden
    >
      <rect x="0.5" y="0.5" width="27" height="31" fill="none" stroke="currentColor" strokeWidth="1" />
      <line x1="0" x2="28" y1="6" y2="6" stroke="currentColor" strokeWidth="0.5" />
      <line x1="0" x2="28" y1="11" y2="11" stroke="currentColor" strokeWidth="0.5" />
      <line x1="0" x2="28" y1="16" y2="16" stroke="currentColor" strokeWidth="0.5" />
      <line x1="0" x2="28" y1="21" y2="21" stroke="currentColor" strokeWidth="0.5" />
      <line x1="0" x2="28" y1="26" y2="26" stroke="currentColor" strokeWidth="0.5" />
      <rect x="3" y="13" width="22" height="5" fill="var(--accent)" />
      <circle cx="22" cy="15.5" r="0.8" fill="currentColor" />
    </svg>
  );
}
