import React, { useState } from 'react';
import { FABRIC_HIGHLIGHTS } from '../data/products';
import { Layers, CheckCircle2 } from 'lucide-react';

export const FabricDetailSection: React.FC = () => {
  const [activeHighlight, setActiveHighlight] = useState(0);

  return (
    <section id="fabric-details" className="border-b border-white/10 bg-[#0a0a0a] relative overflow-hidden py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 border-b border-white/10 pb-6 gap-6">
          <div>
            <span className="text-[10px] sm:text-xs font-mono tracking-[0.3em] text-white/50 uppercase block mb-2">
              // 03. MATERIAL SCIENCE & ARCHITECTURE
            </span>
            <h2 className="font-head text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white uppercase">
              TECHNICAL <span className="font-accent italic text-white/70 font-normal">standards</span>.
            </h2>
          </div>
          <p className="font-body text-xs sm:text-sm text-white/60 font-light max-w-md">
            Every millimeter of weave is calibrated for architectural drape, extreme thermal stability, and lifelong structural integrity.
          </p>
        </div>

        {/* 4 Interactive Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {FABRIC_HIGHLIGHTS.map((item, index) => {
            const isActive = activeHighlight === index;
            return (
              <div
                key={item.id}
                onClick={() => setActiveHighlight(index)}
                className={`p-6 sm:p-8 border transition-all duration-300 flex flex-col justify-between cursor-pointer select-none ${
                  isActive
                    ? 'border-white bg-[#141414] shadow-2xl scale-[1.02]'
                    : 'border-white/10 bg-[#0e0e0e] hover:border-white/30 hover:bg-[#121212]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-white/40 mb-6">
                    <span>[ SPEC.0{index + 1} ]</span>
                    <span className={`px-1.5 py-0.5 text-[9px] uppercase border ${isActive ? 'bg-white text-black border-white font-bold' : 'border-white/10 text-white/40'}`}>
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="font-head text-lg sm:text-xl font-bold tracking-tight text-white uppercase mb-2">
                    {item.title}
                  </h3>

                  <p className="font-accent italic text-xs text-white/70 mb-4">
                    {item.subtitle}
                  </p>

                  <p className="font-body text-xs text-white/60 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/40">
                  <span>VERIFIED TESTED</span>
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-white/20'}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Textile Lab Comparison Bar */}
        <div className="mt-8 p-6 sm:p-8 border border-white/10 bg-[#111111] flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border border-white/20 bg-white/5 flex items-center justify-center text-white flex-shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="font-head text-sm font-bold text-white uppercase block">
                NOCTRA HEAVYWEIGHT STANDARD // 480 GSM
              </span>
              <span className="font-mono text-xs text-white/50">
                100% Pre-shrunk Organic Ringspun Loopback Cotton &bull; Zero Torque
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono text-white/70">
            <div>
              <span className="text-white/40 block text-[10px]">WARP TENSILE</span>
              <span className="font-bold text-white">820 N / 5cm</span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <span className="text-white/40 block text-[10px]">COLOR FASTNESS</span>
              <span className="font-bold text-white">GRADE 4.5+</span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <span className="text-white/40 block text-[10px]">SHRINKAGE</span>
              <span className="font-bold text-emerald-400">&lt; 0.8%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
