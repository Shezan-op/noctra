import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const AgitationSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const leftColRef = useRef<HTMLDivElement | null>(null);
  const rightColRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const revElements = sectionRef.current?.querySelectorAll('.rev-text');
      if (revElements && revElements.length > 0) {
        revElements.forEach((el) => {
          gsap.from(el, {
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              end: 'bottom 15%',
              toggleActions: 'play none none reverse',
            },
            y: 60,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="border-b border-white/10 bg-[#0c0c0c] relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[50vh]">
        {/* Left Column: Bold Statement (Responsive, No Overflow) */}
        <div
          ref={leftColRef}
          className="lg:col-span-5 p-6 sm:p-10 lg:p-12 xl:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 relative overflow-hidden"
        >
          <div className="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase mb-6 sm:mb-8 flex items-center gap-2 rev-text">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
            <span>// 01. THE PROBLEM</span>
          </div>

          <div className="space-y-1">
            <h2 className="font-head text-3xl sm:text-5xl lg:text-[2.75rem] xl:text-6xl font-extrabold tracking-tight leading-[0.95] text-white uppercase break-words rev-text">
              EVERYONE
            </h2>
            <h2 className="font-head text-3xl sm:text-5xl lg:text-[2.75rem] xl:text-6xl font-extrabold tracking-tight leading-[0.95] text-white uppercase break-words rev-text">
              LOOKS
            </h2>
            <h2 className="font-head text-3xl sm:text-5xl lg:text-[2.75rem] xl:text-6xl font-extrabold tracking-tight leading-[0.95] text-white/35 uppercase break-words rev-text">
              THE SAME.
            </h2>
          </div>

          <div className="mt-8 sm:mt-10 pt-6 border-t border-white/5 text-[11px] font-mono text-white/40 flex items-center justify-between rev-text">
            <span>[ SYSTEM OBSOLESCENCE ]</span>
            <span>CLONE INDEX: 99.4%</span>
          </div>
        </div>

        {/* Right Column: Editorial Argument */}
        <div
          ref={rightColRef}
          className="lg:col-span-7 p-6 sm:p-10 lg:p-12 xl:p-16 flex flex-col justify-center space-y-6 bg-[#0f0f0f]/40"
        >
          <p className="font-accent text-2xl sm:text-3xl lg:text-3xl xl:text-4xl text-white leading-tight font-normal rev-text">
            The streets are flooded with clones.
          </p>

          <p className="font-body text-sm sm:text-base text-white/70 font-light leading-relaxed max-w-xl rev-text">
            Mass-produced fast fashion has killed individuality. Thin fabrics that disintegrate after three washes, trend cycles engineered for disposable consumption, and uniforms disguised as novelty.
          </p>

          <p className="font-body text-sm text-white/60 font-light leading-relaxed max-w-xl rev-text">
            NOCTRA was born to reject this algorithmic conformity. We produce in strictly limited batches using high-density archival textiles that age with distinction.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10 rev-text">
            <div className="p-4 border border-white/10 bg-white/5">
              <span className="block font-mono text-[10px] text-white/50 tracking-widest uppercase mb-1">
                CONVENTIONAL FASHION
              </span>
              <span className="font-head text-xs sm:text-sm text-white/80">180 GSM &bull; Polyester Blends</span>
            </div>
            <div className="p-4 border border-white/20 bg-white/10">
              <span className="block font-mono text-[10px] text-white/70 tracking-widest uppercase mb-1">
                NOCTRA STANDARD
              </span>
              <span className="font-head text-xs sm:text-sm text-white font-bold">480 GSM &bull; Japanese Cotton</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
