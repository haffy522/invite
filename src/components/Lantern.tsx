export default function Lantern({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="lanternGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e8b923" />
          <stop offset="100%" stopColor="#b8860b" />
        </linearGradient>
        <radialGradient id="glowGrad" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#f0cc55" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#f0cc55" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Chain */}
      <line x1="30" y1="0" x2="30" y2="15" stroke="#d4a017" strokeWidth="1.5" />
      {/* Top cap */}
      <rect x="22" y="15" width="16" height="5" rx="1" fill="url(#lanternGrad)" />
      {/* Body */}
      <path
        d="M22 20 Q15 40 15 55 Q15 70 30 75 Q45 70 45 55 Q45 40 38 20 Z"
        fill="url(#lanternGrad)"
        opacity="0.85"
      />
      {/* Glow */}
      <ellipse cx="30" cy="50" rx="20" ry="25" fill="url(#glowGrad)" />
      {/* Inner pattern lines */}
      <path d="M25 25 Q20 45 22 65" stroke="#f7de8a" strokeWidth="0.5" opacity="0.5" />
      <path d="M35 25 Q40 45 38 65" stroke="#f7de8a" strokeWidth="0.5" opacity="0.5" />
      <path d="M30 22 L30 72" stroke="#f7de8a" strokeWidth="0.5" opacity="0.3" />
      {/* Bottom cap */}
      <rect x="25" y="73" width="10" height="4" rx="1" fill="url(#lanternGrad)" />
      {/* Bottom finial */}
      <circle cx="30" cy="80" r="2" fill="#d4a017" />
    </svg>
  );
}
