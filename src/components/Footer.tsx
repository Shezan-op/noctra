import React, { useState, useEffect } from 'react';
import { ArrowUp, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  const [utcTime, setUtcTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().split(' ')[4] + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#080808] border-t border-white/10 text-white relative">
      {/* Upper Navigation & Info Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-white/10 text-xs font-mono">
        <div className="space-y-3">
          <span className="text-[10px] text-white/40 tracking-[0.2em] uppercase block">
            // SILHOUETTES
          </span>
          <ul className="space-y-2 text-white/70">
            <li>
              <button onClick={() => scrollTo('lookbook')} className="hover:text-white transition-colors">
                GHOST HOODIE
              </button>
            </li>
            <li>
              <button onClick={() => scrollTo('lookbook')} className="hover:text-white transition-colors">
                COMBAT TROUSERS
              </button>
            </li>
            <li>
              <button onClick={() => scrollTo('lookbook')} className="hover:text-white transition-colors">
                OBSIDIAN BUTTON-UP
              </button>
            </li>
            <li>
              <button onClick={() => scrollTo('lookbook')} className="hover:text-white transition-colors">
                CORE HEAVY TEE
              </button>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <span className="text-[10px] text-white/40 tracking-[0.2em] uppercase block">
            // EDITORIAL
          </span>
          <ul className="space-y-2 text-white/70">
            <li>
              <button onClick={() => scrollTo('fabric-details')} className="hover:text-white transition-colors">
                450 GSM SPECS
              </button>
            </li>
            <li>
              <button onClick={() => scrollTo('manifesto')} className="hover:text-white transition-colors">
                THE MANIFESTO
              </button>
            </li>
            <li>
              <button onClick={() => scrollTo('solution')} className="hover:text-white transition-colors">
                REF.02 SPOTLIGHT
              </button>
            </li>
            <li>
              <button onClick={() => scrollTo('vip-drop')} className="hover:text-white transition-colors">
                VIP DROP 02
              </button>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <span className="text-[10px] text-white/40 tracking-[0.2em] uppercase block">
            // ATELIER & STUDIO
          </span>
          <ul className="space-y-2 text-white/70">
            <li className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-white/40" />
              <span>TOKYO &bull; PORTO &bull; NYC</span>
            </li>
            <li>
              <span className="text-white/50">TIME:</span> {utcTime || '00:00:00 UTC'}
            </li>
            <li>
              <span className="text-white/50">STATUS:</span> ARCHIVE OPERATIONAL
            </li>
          </ul>
        </div>

        <div className="space-y-3 flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-white/40 tracking-[0.2em] uppercase block">
              // SOCIAL & DISPATCH
            </span>
            <ul className="space-y-2 text-white/70">
              <li>
                <a href="#instagram" className="hover:text-white transition-colors">
                  INSTAGRAM / @NOCTRA
                </a>
              </li>
              <li>
                <a href="#twitter" className="hover:text-white transition-colors">
                  X / @NOCTRA_ARCHIVE
                </a>
              </li>
              <li>
                <a href="#dispatch" className="hover:text-white transition-colors">
                  EDITORIAL DISPATCH
                </a>
              </li>
            </ul>
          </div>

          <button
            onClick={scrollToTop}
            className="self-start mt-4 sm:mt-0 p-2.5 border border-white/20 hover:border-white text-white/70 hover:text-white transition-all flex items-center gap-2"
            title="Back to top"
          >
            <ArrowUp className="w-4 h-4" />
            <span className="text-[10px]">TOP</span>
          </button>
        </div>
      </div>

      {/* Massive Brutalist NOCTRA Logo */}
      <div className="py-8 sm:py-12 text-center select-none overflow-hidden group">
        <h1
          onClick={scrollToTop}
          className="font-head text-[16vw] sm:text-[14vw] font-black tracking-tight leading-none text-white/90 hover:text-white transition-colors cursor-pointer stroke-text-bold hover:stroke-none"
        >
          NOCTRA
        </h1>
      </div>

      {/* Bottom Legal & Meta Bar */}
      <div className="border-t border-white/10 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-mono text-white/40">
          <div>© 2026 NOCTRA ARCHIVE &bull; ALL RIGHTS RESERVED</div>
          <div className="flex items-center gap-6">
            <a href="#terms" className="hover:text-white transition-colors">TERMS OF SALE</a>
            <a href="#privacy" className="hover:text-white transition-colors">PRIVACY POLICY</a>
            <span>CURRENCY: USD ($)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
