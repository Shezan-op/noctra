import React, { useEffect, useRef } from 'react';
import { ArrowUpRight, Scissors } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const SplitSection: React.FC = () => {
  const { openProductModal } = useCart();
  const tee = PRODUCTS.find((p) => p.id === 'core-tee') || PRODUCTS[3];
  const shirt = PRODUCTS.find((p) => p.id === 'obsidian-button-up') || PRODUCTS[2];

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const img1Ref = useRef<HTMLImageElement | null>(null);
  const img2Ref = useRef<HTMLImageElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax effect on Detail Shot 1
      if (img1Ref.current) {
        gsap.to(img1Ref.current, {
          scrollTrigger: {
            trigger: img1Ref.current.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
          y: -60,
          scale: 1.1,
          ease: 'none',
        });
      }

      // Parallax effect on Detail Shot 2
      if (img2Ref.current) {
        gsap.to(img2Ref.current, {
          scrollTrigger: {
            trigger: img2Ref.current.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
          y: -60,
          scale: 1.1,
          ease: 'none',
        });
      }

      // Text reveal animation
      if (stickyRef.current) {
        const textElements = stickyRef.current.querySelectorAll('.rev-cut-text');
        gsap.from(textElements, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            end: 'bottom 25%',
            toggleActions: 'play none none reverse',
          },
          y: 40,
          opacity: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="border-b border-white/10 bg-[#0c0c0c] relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Sticky Editorial Statement with GSAP */}
        <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 xl:p-16 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between relative">
          <div ref={stickyRef} className="lg:sticky lg:top-32 space-y-6">
            <div className="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase flex items-center gap-2 rev-cut-text">
              <Scissors className="w-3.5 h-3.5" />
              <span>// 04. PATTERN CUTTING ARCHIVE</span>
            </div>

            <h2 className="font-head text-3xl sm:text-5xl lg:text-[2.75rem] xl:text-6xl font-extrabold tracking-tight leading-[0.95] text-white uppercase break-words rev-cut-text">
              IT'S IN <br />
              <span className="font-accent italic text-white/80 font-normal">the cut</span>.
            </h2>

            <p className="font-body text-sm sm:text-base text-white/70 font-light leading-relaxed rev-cut-text">
              We spent six months perfecting the drape so you don't have to think about it. Every stitch, every seam is intentional.
            </p>

            <div className="pt-4 border-t border-white/10 space-y-3 font-mono text-xs text-white/60 rev-cut-text">
              <div className="flex items-center justify-between">
                <span>SHOULDER DROP:</span>
                <span className="text-white font-bold">14.5 CM ANGULAR</span>
              </div>
              <div className="flex items-center justify-between">
                <span>COLLAR INTERFACING:</span>
                <span className="text-white font-bold">DOUBLE FUSED</span>
              </div>
              <div className="flex items-center justify-between">
                <span>SLEEVE APERTURE:</span>
                <span className="text-white font-bold">BOXY OVERSIZED</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:block pt-12 text-[10px] font-mono text-white/30">
            <span>FIGURE 04 &bull; PRECISION PATTERN CUTS &bull; GSAP PARALLAX ACTIVE</span>
          </div>
        </div>

        {/* Right Column: High-Res Editorial Detail Shots with GSAP Parallax */}
        <div className="lg:col-span-7 flex flex-col bg-[#0e0e0e]">
          {/* Detail Shot 1: Core Tee */}
          <div
            className="p-6 sm:p-10 lg:p-12 border-b border-white/10 flex flex-col group cursor-pointer overflow-hidden"
            onClick={() => openProductModal(tee)}
          >
            <div className="flex items-center justify-between text-[10px] font-mono text-white/40 mb-4">
              <span>[ DETAIL 01 // SEAMLESS TUBULAR KNIT ]</span>
              <span className="flex items-center gap-1 group-hover:text-white transition-colors">
                INSPECT <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <div className="relative w-full aspect-[4/3] bg-black/40 border border-white/10 overflow-hidden flex items-center justify-center p-8">
              <img
                ref={img1Ref}
                src="/white-t-shirt.png"
                alt="Core Tee Detail Shot"
                className="w-full h-full object-contain filter-bw transition-filter duration-700 group-hover:filter-none will-change-transform"
                loading="lazy"
              />
            </div>
            <div className="mt-4 flex items-center justify-between font-mono text-xs">
              <span className="text-white font-bold uppercase">{tee.name}</span>
              <span className="text-white/60">${tee.price} USD</span>
            </div>
          </div>

          {/* Detail Shot 2: Obsidian Shirt */}
          <div
            className="p-6 sm:p-10 lg:p-12 flex flex-col group cursor-pointer overflow-hidden"
            onClick={() => openProductModal(shirt)}
          >
            <div className="flex items-center justify-between text-[10px] font-mono text-white/40 mb-4">
              <span>[ DETAIL 02 // BONDED SEAM TAPING ]</span>
              <span className="flex items-center gap-1 group-hover:text-white transition-colors">
                INSPECT <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <div className="relative w-full aspect-[4/3] bg-black/40 border border-white/10 overflow-hidden flex items-center justify-center p-8">
              <img
                ref={img2Ref}
                src="/black-shirt.png"
                alt="Obsidian Shirt Detail Shot"
                className="w-full h-full object-contain filter-bw transition-filter duration-700 group-hover:filter-none will-change-transform"
                loading="lazy"
              />
            </div>
            <div className="mt-4 flex items-center justify-between font-mono text-xs">
              <span className="text-white font-bold uppercase">{shirt.name}</span>
              <span className="text-white/60">${shirt.price} USD</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
