import React from "react";

export function Logo({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
        <linearGradient id="eyeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f766e" />
          <stop offset="100%" stopColor="#134e4a" />
        </linearGradient>
      </defs>

      {/* Main circular background */}
      <circle cx="50" cy="50" r="48" fill="url(#logoGradient)" />

      {/* Eye sclera (white part) - more refined shape */}
      <ellipse cx="50" cy="50" rx="28" ry="18" fill="white" opacity="0.98" />

      {/* Eye iris (dark teal) - better proportioned */}
      <circle cx="50" cy="50" r="14" fill="url(#eyeGradient)" />

      {/* Eye pupil (white highlight) - more realistic */}
      <circle cx="50" cy="50" r="5" fill="white" />

      {/* Refined eyelid - left side */}
      <path
        d="M 22 45 Q 15 35, 22 35 Q 30 40, 22 45"
        fill="url(#eyeGradient)"
        opacity="0.9"
      />

      {/* Refined eyelid - right side */}
      <path
        d="M 78 45 Q 85 35, 78 35 Q 70 40, 78 45"
        fill="url(#eyeGradient)"
        opacity="0.9"
      />

      {/* Eye highlight for depth */}
      <ellipse cx="45" cy="45" rx="3" ry="2" fill="white" opacity="0.6" />

      {/* Magnifying glass lens */}
      <circle
        cx="67"
        cy="67"
        r="16"
        fill="white"
        stroke="url(#eyeGradient)"
        strokeWidth="3"
        opacity="0.9"
      />

      {/* Magnifying glass frame */}
      <circle
        cx="67"
        cy="67"
        r="16"
        fill="none"
        stroke="url(#eyeGradient)"
        strokeWidth="2"
      />

      {/* Magnifying glass handle - more elegant */}
      <path
        d="M 80 80 Q 85 85, 75 90 Q 70 95, 65 90"
        stroke="url(#eyeGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Red alert dot */}
      <circle cx="70" cy="35" r="3" fill="#ef4444" />
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
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
        <linearGradient
          id="iconEyeGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#0f766e" />
          <stop offset="100%" stopColor="#134e4a" />
        </linearGradient>
      </defs>

      {/* Main circular background */}
      <circle cx="50" cy="50" r="48" fill="url(#iconGradient)" />

      {/* Simplified eye shape - refined */}
      <ellipse cx="50" cy="50" rx="22" ry="14" fill="white" opacity="0.98" />

      {/* Eye iris - better proportioned */}
      <circle cx="50" cy="50" r="10" fill="url(#iconEyeGradient)" />

      {/* Eye pupil - more realistic */}
      <circle cx="50" cy="50" r="4" fill="white" />

      {/* Eye highlight */}
      <ellipse cx="47" cy="47" rx="2" ry="1.5" fill="white" opacity="0.7" />

      {/* Magnifying glass lens - improved */}
      <circle
        cx="65"
        cy="65"
        r="14"
        fill="white"
        stroke="url(#iconEyeGradient)"
        strokeWidth="2.5"
        opacity="0.9"
      />

      {/* Magnifying glass handle - more elegant */}
      <path
        d="M 76 76 Q 80 80, 75 85"
        stroke="url(#iconEyeGradient)"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Red alert dot */}
      <circle cx="70" cy="35" r="2" fill="#ef4444" />
    </svg>
  );
}
