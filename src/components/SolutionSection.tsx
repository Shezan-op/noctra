import React, { useState } from 'react';
import { PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';
import { Sparkles, Eye, Plus } from 'lucide-react';

export const SolutionSection: React.FC = () => {
  const { openProductModal, addToCart } = useCart();
  const combatPant = PRODUCTS.find((p) => p.id === 'combat-trousers') || PRODUCTS[4];
  const [selectedSpecIndex, setSelectedSpecIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL'>('M');

  const specsDetails = [
    {
      title: '// 450GSM DENSE CORDURA',
      detail: 'High-tensile ripstop weave engineered to withstand abrasive urban contact while maintaining an architectural drape.',
    },
    {
      title: '// ARTICULATED KNEE DARTS',
      detail: '3D ergonomic tailoring that bends naturally with gait, preventing knee bulge and fabric tension.',
    },
    {
      title: '// FIDLOCK MAGNETIC PULLS',
      detail: 'German-engineered quick-release magnetic tension buckles on pocket bellows for instant one-handed access.',
    },
    {
      title: '// SHOCKCORD ANKLE CINCH',
      detail: 'Customize leg opening from wide-straight to ultra-tapered silhouette in seconds with anodized hardware.',
    },
  ];

  return (
    <section id="solution" className="border-b border-white/10 bg-[#0c0c0c] relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[70vh]">
        {/* Left Column: Spotlight Item Image */}
        <div className="lg:col-span-6 p-6 sm:p-10 lg:p-16 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between group">
          <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-white/50 mb-6">
            <span>[ SPOTLIGHT // REF.02 ]</span>
            <span className="text-white bg-white/10 px-2 py-0.5 font-bold">LIMITED DROP</span>
          </div>

          {/* Interactive Image Container */}
          <div className="relative w-full aspect-[4/5] bg-[#111111] overflow-hidden border border-white/10 flex items-center justify-center p-6 sm:p-8">
            <img
              src={combatPant.image}
              alt={combatPant.name}
              className="w-full h-full object-contain filter-bw transition-all duration-700 group-hover:scale-105 group-hover:filter-none"
            />

            {/* Quick Action Overlay on Desktop */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-center justify-center gap-3 p-4">
              <button
                onClick={() => openProductModal(combatPant)}
                className="px-4 py-3 bg-white text-black font-head text-xs tracking-wider flex items-center gap-2 hover:bg-white/90 transition-all font-bold cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>INSPECT SILHOUETTE</span>
              </button>
            </div>

            <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono text-white/80 border border-white/10">
              {combatPant.color}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between font-mono text-xs text-white/70">
            <span className="font-bold text-white uppercase">{combatPant.name}</span>
            <span className="text-white">${combatPant.price} USD</span>
          </div>
        </div>

        {/* Right Column: Narrative & Tech Specs */}
        <div className="lg:col-span-6 p-6 sm:p-10 lg:p-16 flex flex-col justify-between bg-[#0e0e0e] space-y-6">
          <div>
            <div className="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase mb-4 flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-white/80" />
              <span>// 02. THE NOCTRA DOCTRINE</span>
            </div>

            <h2 className="font-head text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[0.95] text-white uppercase">
              ENTER <br />
              <span className="font-accent italic text-white/90 lowercase">noctra</span>.
            </h2>

            <p className="font-body text-xs sm:text-base text-white/70 font-light leading-relaxed mt-4 sm:mt-6">
              We don’t design for the masses. We engineer streetwear for the outliers. Premium heavyweight textiles, aggressive cuts, and a monochromatic palette that speaks louder than neon.
            </p>

            {/* Interactive Tech Specs Accordion (48px Touch Envelope) */}
            <div className="mt-6 sm:mt-8 space-y-3">
              <span className="block font-mono text-[10px] text-white/40 tracking-widest uppercase">
                ENGINEERING SPECIFICATIONS [TAP TO EXPAND]
              </span>
              <div className="space-y-2">
                {specsDetails.map((spec, index) => {
                  const isSelected = selectedSpecIndex === index;
                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedSpecIndex(index)}
                      className={`min-h-[48px] p-3 sm:p-3.5 border transition-all cursor-pointer select-none active:scale-[0.99] ${
                        isSelected
                          ? 'border-white bg-white/10'
                          : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/[0.07]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono font-bold text-white">
                        <span>{spec.title}</span>
                        <span className="text-white/40 text-[10px]">{isSelected ? 'ACTIVE' : '+'}</span>
                      </div>
                      {isSelected && (
                        <p className="mt-2 text-xs font-body text-white/80 font-light leading-relaxed animate-fadeIn">
                          {spec.detail}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Add Bar for the Spotlight Item with 44px+ Touch Targets */}
          <div className="pt-6 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-white/60">SELECT SIZE:</span>
              <div className="flex gap-1.5">
                {(['S', 'M', 'L', 'XL'] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`min-w-[40px] min-h-[40px] text-xs font-mono font-bold flex items-center justify-center border transition-all cursor-pointer active:scale-95 ${
                      selectedSize === sz
                        ? 'bg-white text-black border-white'
                        : 'bg-transparent text-white/70 border-white/20 hover:border-white/60'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => addToCart(combatPant, selectedSize)}
                className="flex-1 min-h-[48px] bg-white text-black font-head text-xs tracking-widest uppercase font-bold hover:bg-white/90 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Plus className="w-4 h-4" />
                <span>ADD TO BAG &bull; ${combatPant.price}</span>
              </button>
              <button
                onClick={() => openProductModal(combatPant)}
                className="min-w-[48px] min-h-[48px] border border-white/20 text-white font-mono text-xs hover:border-white transition-all flex items-center justify-center cursor-pointer active:scale-95"
                title="View specs and photos"
                aria-label="Inspect Silhouette"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
