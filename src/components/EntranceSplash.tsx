'use client';

import React, { useEffect, useState } from 'react';
import AnimatedLogo from './AnimatedLogo';

export default function EntranceSplash() {
  const [visible, setVisible] = useState(true);
  const [fadeState, setFadeState] = useState<'entering' | 'fading' | 'gone'>('entering');

  useEffect(() => {
    // Check if the user has already seen the splash in this browser session
    const alreadyShown = sessionStorage.getItem('ru_splash_shown');
    if (alreadyShown) {
      setFadeState('gone');
      setVisible(false);
      return;
    }

    // Mark as shown for the current session
    sessionStorage.setItem('ru_splash_shown', 'true');

    // Start fade-out after 1.5 seconds of rotating logo presentation
    const fadeTimer = setTimeout(() => {
      setFadeState('fading');
    }, 1500);

    // Completely unmount after transition finishes (1.5s + 700ms)
    const removeTimer = setTimeout(() => {
      setFadeState('gone');
      setVisible(false);
    }, 2200);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  const handleDismiss = () => {
    setFadeState('fading');
    setTimeout(() => {
      setFadeState('gone');
      setVisible(false);
    }, 400);
  };

  if (!visible || fadeState === 'gone') {
    return null;
  }

  return (
    <div
      onClick={handleDismiss}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-all duration-700 ease-out cursor-pointer select-none overflow-hidden ${
        fadeState === 'fading'
          ? 'opacity-0 scale-105 pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
      aria-label="Welcome to RU Insiders"
    >
      {/* Paris Road Theme Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/campus/paris-road-rain.jpg"
          alt="Rajshahi University Paris Road"
          className="w-full h-full object-cover scale-105 animate-pulse"
          style={{ animationDuration: '6s' }}
        />
        {/* Cinematic Emerald & Slate Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-emerald-950/75 to-slate-950/90 backdrop-blur-[2px]" />
        {/* Ambient Radial Spotlight */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.25)_0%,rgba(245,158,11,0.15)_35%,transparent_70%)] pointer-events-none" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center text-center p-6 space-y-5 max-w-sm mx-auto animate-in fade-in zoom-in-95 duration-500">
        
        {/* Animated Rotating Logo with Glowing Paris Road Halo */}
        <div className="relative p-2.5 rounded-full bg-white/95 shadow-[0_0_50px_rgba(16,185,129,0.4)] border-2 border-amber-300 ring-4 ring-white/20">
          <AnimatedLogo size={136} speed="fast" withBorder={false} />
          
          {/* Subtle Outer Pulsing Halo */}
          <div
            className="absolute inset-0 rounded-full border border-amber-400/50 animate-ping pointer-events-none"
            style={{ animationDuration: '2.8s' }}
          />
        </div>

        {/* Brand Text: Only RU Insiders */}
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
          RU Insiders
        </h1>
      </div>
    </div>
  );
}

