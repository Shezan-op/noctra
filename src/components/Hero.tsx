import React, { useState, useEffect, useRef } from 'react';
import { HeroCanvas, GARMENTS } from './HeroCanvas';
import { Marquee } from './Marquee';
import { ArrowDown, Layers, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Hero: React.FC = () => {
  const [activeGarmentName, setActiveGarmentName] = useState('GHOST HOODIE');
  const [scrollActiveIndex, setScrollActiveIndex] = useState(0);

  const heroSectionRef = useRef<HTMLDivElement | null>(null);
  const heroPinnedRef = useRef<HTMLDivElement | null>(null);
  const bgTitleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      if (heroSectionRef.current && heroPinnedRef.current) {
        // Desktop uses full scroll scrub; mobile uses relaxed pinned range so touch scroll is fast & fluid
        ScrollTrigger.create({
          trigger: heroSectionRef.current,
          start: 'top top',
          end: isMobile ? '+=100%' : '+=200%',
          pin: heroPinnedRef.current,
          scrub: isMobile ? 0.3 : 0.6,
          onUpdate: (self) => {
            const progress = self.progress;
            const targetIdx = Math.min(GARMENTS.length - 1, Math.floor(progress * GARMENTS.length));
            setScrollActiveIndex(targetIdx);
            setActiveGarmentName(GARMENTS[targetIdx].name);
          },
        });

        // Parallax depth shift
        if (bgTitleRef.current) {
          gsap.to(bgTitleRef.current, {
            scrollTrigger: {
              trigger: heroSectionRef.current,
              start: 'top top',
              end: isMobile ? '+=100%' : '+=200%',
              scrub: 1,
            },
            yPercent: isMobile ? -8 : -15,
            scale: 1.05,
            ease: 'none',
          });
        }
      }
    }, heroSectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToLookbook = () => {
    const el = document.getElementById('lookbook');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={heroSectionRef} className="relative bg-[#0c0c0c] border-b border-white/10 min-h-[160vh] md:min-h-[220vh]">
      {/* Pinned Sticky Viewport Area */}
      <div ref={heroPinnedRef} className="h-screen w-full flex flex-col justify-between overflow-hidden relative pt-16 sm:pt-20">
        {/* Top runway ticker */}
        <Marquee />

        {/* Main Viewport Content */}
        <div className="relative flex-1 flex flex-col justify-between items-center py-2 sm:py-6 px-3 sm:px-6 overflow-hidden">
          {/* Massive Background Outlined Text (Behind Canvas) */}
          <div
            ref={bgTitleRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0 opacity-20 sm:opacity-25 will-change-transform"
          >
            <span className="font-head text-[22vw] sm:text-[18vw] leading-none tracking-tight stroke-text font-black uppercase text-center block">
              NOCTRA
            </span>
          </div>

          {/* Top Spec Header */}
          <div className="w-full max-w-7xl flex items-center justify-between z-20 text-[9px] sm:text-xs font-mono tracking-widest text-white/50 border-b border-white/5 pb-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
              <span className="text-white/90 font-bold">[ SYS.GEN.01 ]</span>
              <span className="hidden sm:inline text-white/40">// SCROLL RUNWAY</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 text-white/60">
              <span className="hidden sm:inline">
                ACTIVE: {GARMENTS[scrollActiveIndex].weight}
              </span>
              <span className="text-white/90 font-bold bg-white/10 px-2 py-0.5 border border-white/15">
                0{scrollActiveIndex + 1} / 0{GARMENTS.length}
              </span>
            </div>
          </div>

          {/* Left Vertical Interactive Product Rail (Desktop Only) */}
          <div className="hidden xl:flex absolute left-8 top-1/2 -translate-y-1/2 z-20 flex-col gap-3 font-mono text-[10px] text-white/40 border-l border-white/10 pl-3">
            <span className="text-[9px] tracking-widest text-white/60 mb-1 flex items-center gap-1">
              <Layers className="w-3 h-3" /> ARCHIVE STACK
            </span>
            {GARMENTS.map((g, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setScrollActiveIndex(idx);
                  setActiveGarmentName(g.name);
                }}
                className={`text-left flex items-center gap-2 transition-all cursor-pointer ${
                  scrollActiveIndex === idx
                    ? 'text-white font-bold translate-x-1.5'
                    : 'hover:text-white/80'
                }`}
              >
                <span className={`w-1.5 h-1.5 ${scrollActiveIndex === idx ? 'bg-white' : 'bg-white/20'}`} />
                <span>{g.name}</span>
              </button>
            ))}
          </div>

          {/* Central Interactive Particle Morph Canvas */}
          <div className="relative z-10 w-full max-w-2xl h-[46vh] sm:h-[50vh] lg:h-[54vh] min-h-[280px] flex items-center justify-center my-auto">
            <HeroCanvas
              controlledIndex={scrollActiveIndex}
              onGarmentChange={(name, idx) => {
                setActiveGarmentName(name);
                setScrollActiveIndex(idx);
              }}
            />
          </div>

          {/* Bottom Editorial Copy & Scroll Indicator */}
          <div className="w-full max-w-7xl flex flex-col sm:flex-row items-center sm:items-end justify-between gap-3 sm:gap-4 z-20 pt-2 border-t border-white/5">
            {/* Left Copy */}
            <div className="space-y-0.5 sm:space-y-1 max-w-sm text-center sm:text-left">
              <p className="font-accent text-base sm:text-2xl text-white/95 leading-tight font-normal">
                The standard is obsolete.
              </p>
              <p className="font-body text-[11px] sm:text-xs text-white/60 font-light leading-relaxed">
                Scroll vertically to morph through 6 archival streetwear silhouettes.
              </p>
            </div>

            {/* Center Callout Pill (Desktop) */}
            <div className="hidden lg:flex items-center gap-2.5 bg-white/5 border border-white/10 px-3.5 py-1.5 text-xs font-mono">
              <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span className="text-white/40">SCROLL DRIVEN:</span>
              <span className="text-white font-bold">{activeGarmentName}</span>
              <span className="text-[9px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.2">
                GSAP ACTIVE
              </span>
            </div>

            {/* Right Scroll Indicator with 44px Touch Target */}
            <button
              onClick={scrollToLookbook}
              className="min-h-[44px] flex items-center gap-2.5 border border-white/20 bg-white/5 hover:bg-white hover:text-black px-4 py-2.5 sm:px-5 sm:py-3 transition-all text-[11px] sm:text-xs font-mono tracking-widest text-white/90 group cursor-pointer active:scale-95"
            >
              <span>SCROLL CATALOG</span>
              <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
