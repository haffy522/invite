export default function CrescentMoon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0cc55" />
          <stop offset="100%" stopColor="#d4a017" />
        </linearGradient>
      </defs>
      <path
        d="M50 5C28 5 10 23 10 50s18 45 40 45c-15-8-25-24-25-43S33 13 50 5z"
        fill="url(#moonGrad)"
        opacity="0.9"
      />
      {/* Small star beside crescent */}
      <circle cx="72" cy="22" r="2.5" fill="#f0cc55" opacity="0.8" />
      <circle cx="80" cy="35" r="1.5" fill="#f0cc55" opacity="0.6" />
    </svg>
  );
}
