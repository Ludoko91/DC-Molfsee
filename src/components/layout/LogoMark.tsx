export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      className={className}
      aria-hidden
    >
      <circle cx="16" cy="16" r="15" fill="var(--accent-light)" stroke="var(--accent)" strokeWidth="1.5" />
      <path
        d="M16 6 L20 24 L16 22 L12 24 Z"
        fill="var(--accent)"
        stroke="var(--accent-deep)"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      <rect x="14" y="10" width="4" height="3" rx="0.5" fill="#ffffff" opacity="0.9" />
      <rect x="13.5" y="14" width="5" height="2" rx="0.5" fill="#ffffff" opacity="0.7" />
      <rect x="13" y="17" width="6" height="2" rx="0.5" fill="#ffffff" opacity="0.5" />
      <circle cx="24" cy="8" r="3" fill="var(--sun)" opacity="0.85" />
    </svg>
  );
}
