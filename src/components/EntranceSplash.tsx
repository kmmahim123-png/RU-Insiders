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
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/95 backdrop-blur-2xl transition-all duration-700 ease-out cursor-pointer select-none ${
        fadeState === 'fading'
          ? 'opacity-0 scale-105 pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
      aria-label="Welcome to RU Insiders"
    >
      {/* Soft Ambient Radial Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.12)_0%,rgba(245,158,11,0.06)_40%,transparent_70%)] pointer-events-none" />

      {/* Main Container */}
      <div className="relative flex flex-col items-center text-center p-6 space-y-6 max-w-sm mx-auto animate-in fade-in zoom-in-95 duration-500">
        
        {/* Animated Rotating Logo with Ambient Gold Ring */}
        <div className="relative p-2 rounded-full bg-white shadow-2xl shadow-blue-500/15 border-2 border-amber-300">
          <AnimatedLogo size={136} speed="fast" withBorder={false} />
          
          {/* Subtle Outer Pulsing Ring */}
          <div className="absolute inset-0 rounded-full border border-amber-400/40 animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
        </div>

        {/* Brand Text: Only RU Insiders */}
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          RU Insiders
        </h1>
      </div>
    </div>
  );
}

