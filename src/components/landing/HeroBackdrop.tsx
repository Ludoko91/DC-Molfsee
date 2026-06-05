export function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <svg
        className="absolute bottom-0 left-0 h-[55%] w-full"
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 280 C240 220 480 320 720 260 C960 200 1200 300 1440 240 L1440 400 L0 400 Z"
          fill="var(--sea)"
          opacity="0.5"
        />
        <path
          d="M0 320 C300 260 600 340 900 290 C1100 260 1300 310 1440 280 L1440 400 L0 400 Z"
          fill="var(--sea-deep)"
          opacity="0.35"
        />
      </svg>

      <svg
        className="absolute bottom-[18%] left-0 h-[35%] w-full opacity-60"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 160 L120 100 L280 140 L420 80 L580 130 L720 70 L900 120 L1080 60 L1240 110 L1440 50 L1440 200 L0 200 Z"
          fill="rgba(255,255,255,0.35)"
        />
        <path
          d="M0 180 L200 130 L400 170 L600 110 L800 160 L1000 100 L1200 150 L1440 90 L1440 200 L0 200 Z"
          fill="rgba(13,92,92,0.08)"
        />
      </svg>

      <div className="absolute right-[8%] top-[12%] h-16 w-16 rounded-full bg-[var(--sun)] opacity-40 blur-sm" />
      <div className="absolute right-[9%] top-[14%] h-10 w-10 rounded-full bg-[var(--sun)] opacity-70" />
    </div>
  );
}
