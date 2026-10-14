import React from 'react';

export const StudentCompanionIllustration: React.FC<{ className?: string }> = ({ className = 'w-48 h-48 sm:w-56 sm:h-56' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="auraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="denimGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>
          <linearGradient id="tabletGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="backpackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
        </defs>

        {/* Soft Background Backdrop */}
        <circle cx="120" cy="120" r="105" fill="url(#auraGrad)" />
        <circle cx="120" cy="120" r="95" fill="#DDD6FE" />

        {/* Orange Backpack Strap / Bag */}
        <rect x="150" y="80" width="30" height="90" rx="15" fill="url(#backpackGrad)" transform="rotate(12 150 80)" />
        <path d="M 140,95 Q 160,110 165,150" stroke="#EA580C" strokeWidth="6" strokeLinecap="round" fill="none" />

        {/* Denim Jacket Body */}
        <path d="M 65,240 C 65,160 85,135 120,135 C 155,135 175,160 175,240 Z" fill="url(#denimGrad)" />
        {/* Collar */}
        <path d="M 100,135 L 120,155 L 140,135" stroke="#1D4ED8" strokeWidth="4" fill="#3B82F6" />
        <line x1="120" y1="155" x2="120" y2="240" stroke="#1D4ED8" strokeWidth="3" />

        {/* Neck */}
        <rect x="108" y="110" width="24" height="30" rx="6" fill="#F6C8A6" />

        {/* Curly Hair Behind */}
        <circle cx="92" cy="85" r="28" fill="#451A03" />
        <circle cx="148" cy="85" r="28" fill="#451A03" />
        <circle cx="82" cy="105" r="22" fill="#451A03" />
        <circle cx="158" cy="105" r="22" fill="#451A03" />

        {/* Face */}
        <ellipse cx="120" cy="95" rx="30" ry="34" fill="#FDDFC7" />

        {/* Front Curly Hair Curls */}
        <circle cx="98" cy="65" r="18" fill="#451A03" />
        <circle cx="120" cy="60" r="18" fill="#451A03" />
        <circle cx="142" cy="65" r="18" fill="#451A03" />
        <circle cx="88" cy="80" r="15" fill="#451A03" />
        <circle cx="152" cy="80" r="15" fill="#451A03" />

        {/* Glasses (Black frames matching reference image) */}
        <rect x="98" y="86" width="18" height="14" rx="4" fill="rgba(255,255,255,0.4)" stroke="#1E293B" strokeWidth="2.5" />
        <rect x="124" y="86" width="18" height="14" rx="4" fill="rgba(255,255,255,0.4)" stroke="#1E293B" strokeWidth="2.5" />
        <line x1="116" y1="92" x2="124" y2="92" stroke="#1E293B" strokeWidth="2.5" />

        {/* Eyes inside glasses */}
        <circle cx="107" cy="93" r="3" fill="#1E293B" />
        <circle cx="133" cy="93" r="3" fill="#1E293B" />
        <circle cx="108" cy="92" r="1" fill="#FFFFFF" />
        <circle cx="134" cy="92" r="1" fill="#FFFFFF" />

        {/* Smile */}
        <path d="M 112,112 Q 120,120 128,112" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Hands & Emerald Tablet Computer matching reference image! */}
        <g transform="translate(75, 155) rotate(-12)">
          {/* Green Tablet */}
          <rect x="0" y="0" width="70" height="95" rx="8" fill="url(#tabletGrad)" stroke="#047857" strokeWidth="2" />
          {/* Tablet Screen */}
          <rect x="4" y="4" width="62" height="87" rx="5" fill="#064E3B" opacity="0.4" />
          <line x1="12" y1="20" x2="45" y2="20" stroke="#6EE7B7" strokeWidth="3" strokeLinecap="round" />
          <line x1="12" y1="30" x2="58" y2="30" stroke="#A7F3D0" strokeWidth="2" strokeLinecap="round" />
          <line x1="12" y1="38" x2="50" y2="38" stroke="#A7F3D0" strokeWidth="2" strokeLinecap="round" />
          <rect x="12" y="48" width="46" height="30" rx="3" fill="#10B981" opacity="0.3" />

          {/* Student Fingers holding tablet */}
          <rect x="-8" y="35" width="14" height="26" rx="6" fill="#F6C8A6" />
          <rect x="64" y="40" width="14" height="26" rx="6" fill="#F6C8A6" />
        </g>
      </svg>
    </div>
  );
};
