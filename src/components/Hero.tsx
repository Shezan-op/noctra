import React, { useState } from 'react';
import { HeroCanvas } from './HeroCanvas';
import { Marquee } from './Marquee';
import { ArrowDown } from 'lucide-react';

export const Hero: React.FC = () => {
  const [activeGarmentName, setActiveGarmentName] = useState('GHOST HOODIE');

  const scrollToLookbook = () => {
    const el = document.getElementById('lookbook');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-16 sm:pt-20 border-b border-white/10 bg-[#0c0c0c] overflow-hidden">
      {/* Top runway ticker */}
      <Marquee />

      {/* Main Hero Viewport Area */}
      <div className="relative min-h-[75vh] sm:min-h-[82vh] flex flex-col justify-between items-center py-4 sm:py-8 px-4 sm:px-6 overflow-hidden">
        {/* Massive Background Outlined Text (Behind Canvas) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0 opacity-20 sm:opacity-25">
          <span className="font-head text-[22vw] sm:text-[18vw] leading-none tracking-tight stroke-text font-black uppercase text-center block">
            NOCTRA
          </span>
        </div>

        {/* Top Spec Header */}
        <div className="w-full max-w-7xl flex items-center justify-between z-20 text-[10px] sm:text-xs font-mono tracking-widest text-white/50 border-b border-white/5 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-white/80 rounded-full animate-ping"></span>
            <span className="text-white/90 font-bold">[ SYS.GEN.01 ]</span>
            <span className="hidden sm:inline text-white/40">// STREETWEAR EDITORIAL</span>
          </div>
          <div className="flex items-center gap-4 text-white/60">
            <span className="hidden sm:inline">FABRIC: 450–480 GSM</span>
            <span className="text-white/90">DROP 01 LIVE</span>
          </div>
        </div>

        {/* Central Interactive Particle Morph Canvas Container */}
        <div className="relative z-10 w-full max-w-2xl h-[42vh] sm:h-[50vh] lg:h-[54vh] min-h-[300px] flex items-center justify-center my-3">
          <HeroCanvas onGarmentChange={(name) => setActiveGarmentName(name)} />
        </div>

        {/* Bottom Editorial Copy & Scroll Trigger */}
        <div className="w-full max-w-7xl flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 sm:gap-6 z-20 pt-3 border-t border-white/5">
          {/* Left Copy */}
          <div className="space-y-1 max-w-sm">
            <p className="font-accent text-lg sm:text-2xl text-white/95 leading-tight font-normal">
              The standard is obsolete.
            </p>
            <p className="font-body text-xs text-white/60 font-light leading-relaxed">
              Engineered luxury streetwear with aggressive drape, high-density cotton, and monochromatic silhouettes.
            </p>
          </div>

          {/* Center Callout Pill for Active Garment */}
          <div className="hidden lg:flex items-center gap-2.5 bg-white/5 border border-white/10 px-3.5 py-1.5 text-xs font-mono">
            <span className="text-white/40">MORPHING:</span>
            <span className="text-white font-bold">{activeGarmentName}</span>
            <span className="text-[9px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.2">
              60 FPS PARTICLES
            </span>
          </div>

          {/* Right Scroll Indicator Button */}
          <button
            onClick={scrollToLookbook}
            className="flex items-center gap-3 border border-white/20 bg-white/5 hover:bg-white hover:text-black px-4 py-2.5 sm:px-5 sm:py-3 transition-all text-xs font-mono tracking-widest text-white/90 group cursor-pointer"
          >
            <span>SCROLL / DISCOVER</span>
            <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
