import React, { useState, useEffect } from 'react';

interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const [statusText, setStatusText] = useState('LOADING SILHOUETTE ARCHIVE...');

  useEffect(() => {
    // Disable body scroll while preloader is active
    document.body.style.overflow = 'hidden';

    // Simulate progress sequence
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }

        const increment = Math.floor(Math.random() * 8) + 4;
        const next = Math.min(100, prev + increment);

        if (next > 70) {
          setStatusText('INITIALIZING 60FPS PARTICLE MORPH...');
        } else if (next > 40) {
          setStatusText('DECODING 480 GSM TEXTILE SPECS...');
        } else if (next > 15) {
          setStatusText('SYNCING DROP 01 ARCHIVE...');
        }

        return next;
      });
    }, 45);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
        if (onComplete) onComplete();
      }, 400);

      const removeTimer = setTimeout(() => {
        setIsRemoved(true);
        document.body.style.overflow = 'auto';
      }, 1400);

      return () => {
        clearTimeout(exitTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [progress, onComplete]);

  if (isRemoved) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-[#080808] text-[#f4f4f4] flex flex-col justify-between p-6 sm:p-12 transition-transform duration-1000 ease-[cubic-bezier(0.85,0,0.15,1)] ${
        isExiting ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-white/50 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>NOCTRA SYSTEM INIT</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">COLLECTION 2026</span>
          <span className="text-white font-bold">[ DROP 01 ]</span>
        </div>
      </div>

      {/* Center Hero Typography */}
      <div className="my-auto flex flex-col items-center justify-center text-center overflow-hidden py-12">
        <div className="overflow-hidden">
          <h1
            className={`font-head text-[18vw] sm:text-[15vw] font-black tracking-tight leading-none text-white select-none transition-transform duration-700 ease-out uppercase ${
              isExiting ? '-translate-y-full' : 'translate-y-0'
            }`}
          >
            NOCTRA
          </h1>
        </div>

        <div className="overflow-hidden mt-2">
          <p
            className={`font-accent italic text-lg sm:text-2xl text-white/80 transition-transform duration-700 delay-100 ease-out ${
              isExiting ? '-translate-y-full' : 'translate-y-0'
            }`}
          >
            The standard is obsolete.
          </p>
        </div>
      </div>

      {/* Bottom Progress & Status Bar */}
      <div className="space-y-4 border-t border-white/10 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="text-white/40">// STATUS:</span>
            <span className="text-white font-bold">{statusText}</span>
          </div>

          <div className="flex items-center gap-3 font-mono">
            <span className="text-white/40">INITIALIZING:</span>
            <span className="text-2xl sm:text-3xl font-head font-extrabold text-white min-w-[70px] text-right">
              {progress.toString().padStart(3, '0')}%
            </span>
          </div>
        </div>

        {/* Progress Line */}
        <div className="w-full h-1 bg-white/10 overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-white/30 pt-1">
          <span>ARCHIVAL TEXTILES &bull; 480 GSM</span>
          <span>© 2026 NOCTRA ATELIER</span>
        </div>
      </div>
    </div>
  );
};
