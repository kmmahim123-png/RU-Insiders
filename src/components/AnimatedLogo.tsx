'use client';

import React from 'react';

interface AnimatedLogoProps {
  size?: number; // width & height in px
  className?: string;
  speed?: 'slow' | 'normal' | 'fast';
  withBorder?: boolean;
  priority?: boolean;
}

export default function AnimatedLogo({
  size = 48,
  className = '',
  speed = 'normal',
  withBorder = true,
}: AnimatedLogoProps) {
  // Speed mapping (defined in globals.css)
  const speedClass =
    speed === 'fast'
      ? 'animate-spin-hands-fast'
      : speed === 'slow'
      ? 'animate-spin-hands-slow'
      : 'animate-spin-hands';

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative rounded-full overflow-hidden shrink-0 select-none bg-white ${
        withBorder ? 'border-2 border-amber-400 shadow-sm' : ''
      } ${className}`}
      title="RU Insiders Official Logo"
    >
      {/* Layer 1: Stationary Central Rajshahi University Emblem */}
      <img
        src="/logo-center.png"
        alt="RU Emblem"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10"
        loading="eager"
      />

      {/* Layer 2: Revolving Outer Ring of Colorful Community Hands */}
      <img
        src="/logo-hands.png"
        alt="RU Insiders Hands"
        className={`absolute inset-0 w-full h-full object-contain pointer-events-none z-0 ${speedClass}`}
        loading="eager"
      />
    </div>
  );
}

