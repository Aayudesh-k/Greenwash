export function Logo({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle with gradient */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
      </defs>
      
      {/* Main circle background */}
      <circle cx="50" cy="50" r="48" fill="url(#logoGradient)" />
      
      {/* Leaf shape */}
      <path
        d="M 30 50 Q 30 30, 50 30 Q 70 30, 70 50 Q 70 70, 50 60 Q 30 70, 30 50 Z"
        fill="white"
        opacity="0.9"
      />
      
      {/* Leaf vein */}
      <path
        d="M 50 30 L 50 60"
        stroke="url(#logoGradient)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Magnifying glass circle (representing investigation) */}
      <circle 
        cx="65" 
        cy="65" 
        r="12" 
        fill="white" 
        stroke="url(#logoGradient)" 
        strokeWidth="3"
      />
      
      {/* Magnifying glass handle */}
      <path
        d="M 74 74 L 82 82"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
      />
      
      {/* Alert indicator (small dot) */}
      <circle 
        cx="65" 
        cy="65" 
        r="4" 
        fill="#ef4444"
      />
    </svg>
  );
}

export function LogoIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
      </defs>
      
      {/* Simplified leaf with magnifying glass */}
      <path
        d="M 20 50 Q 20 20, 50 20 Q 80 20, 80 50 Q 80 80, 50 65 Q 20 80, 20 50 Z"
        fill="url(#iconGradient)"
      />
      
      {/* Magnifying glass overlay */}
      <circle 
        cx="65" 
        cy="65" 
        r="15" 
        fill="white" 
        stroke="url(#iconGradient)" 
        strokeWidth="4"
      />
      
      <path
        d="M 76 76 L 88 88"
        stroke="white"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}
