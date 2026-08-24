import React, { useState } from 'react';
import { Quote, Terminal } from 'lucide-react';

export const ManifestoSection: React.FC = () => {
  const [activePrinciple, setActivePrinciple] = useState(0);

  const principles = [
    {
      num: '01',
      title: 'FORM OVER TREND',
      quote: 'We discard the seasonal fashion calendar in favor of timeless structural silhouettes that resist obsolescence.',
      body: 'Trends are temporary corporate constructs engineered for recurring waste. Our garments exist as permanent architectural additions to your personal wardrobe.'
    },
    {
      num: '02',
      title: 'TACTILE HONESTY',
      quote: 'The weight of a garment should be felt immediately upon hand contact.',
      body: 'We utilize zero chemical hand-feel modifiers. The substantial drape comes purely from organic loopback density and high-twist yarns.'
    },
    {
      num: '03',
      title: 'SILENT DOMINANCE',
      quote: 'No loud logos. No gaudy neon. Your presence speaks for itself.',
      body: 'True luxury does not require a billboard across the chest. The cut, the shadow, and the fabric density announce your arrival.'
    }
  ];

  return (
    <section id="manifesto" className="border-b border-white/10 bg-[#0a0a0a] py-16 sm:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
          {/* Left Column: Manifesto Title */}
          <div className="lg:col-span-5 space-y-6">
            <div className="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5" />
              <span>// 05. BRAND MANIFESTO</span>
            </div>

            <h2 className="font-head text-4xl sm:text-6xl font-black tracking-tight text-white uppercase leading-[0.9]">
              EMBRACE <br />
              <span className="font-accent italic text-white/80 font-normal">the void</span>.
            </h2>

            <p className="font-body text-sm text-white/70 font-light leading-relaxed">
              NOCTRA operates at the intersection of brutalist architecture, industrial utility, and high-fashion tailoring. We build garments for those who walk through the world on their own terms.
            </p>

            {/* Interactive Principle Switcher Tabs */}
            <div className="pt-4 space-y-2">
              {principles.map((p, idx) => (
                <button
                  key={p.num}
                  onClick={() => setActivePrinciple(idx)}
                  className={`w-full text-left p-4 border transition-all flex items-center justify-between font-mono text-xs ${
                    activePrinciple === idx
                      ? 'border-white bg-white text-black font-bold'
                      : 'border-white/10 bg-white/5 text-white/60 hover:border-white/30 hover:text-white'
                  }`}
                >
                  <span>[{p.num}] {p.title}</span>
                  <span>{activePrinciple === idx ? '●' : '○'}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Active Principle Editorial Card */}
          <div className="lg:col-span-7 bg-[#111111] border border-white/15 p-8 sm:p-12 relative flex flex-col justify-between min-h-[380px]">
            <Quote className="w-10 h-10 text-white/20 mb-6" />

            <div className="space-y-6">
              <p className="font-accent italic text-2xl sm:text-3xl text-white leading-snug">
                "{principles[activePrinciple].quote}"
              </p>

              <p className="font-body text-sm sm:text-base text-white/70 font-light leading-relaxed">
                {principles[activePrinciple].body}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/40">
              <span>PRINCIPLE {principles[activePrinciple].num} // NOCTRA DESIGN DOCTRINE</span>
              <span>EST. 2026</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
