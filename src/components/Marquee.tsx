import React from 'react';

interface MarqueeProps {
  text?: string[];
  className?: string;
  reverse?: boolean;
}

export const Marquee: React.FC<MarqueeProps> = ({
  text = [
    'NEW COLLECTION 2026',
    'DROP 01',
    'EMBRACE THE VOID',
    '450 GSM DENSITY',
    'WORLDWIDE EXPRESS SHIPPING',
    'LIMITED EDITION SILHOUETTES',
    'THE STANDARD IS OBSOLETE'
  ],
  className = '',
  reverse = false,
}) => {
  const content = (
    <div className="flex items-center space-x-8 px-4">
      {text.map((item, index) => (
        <span key={index} className="inline-flex items-center text-[11px] sm:text-xs font-mono tracking-[0.2em] font-semibold uppercase text-white/90 whitespace-nowrap">
          {item}
          <span className="font-accent italic text-white/30 text-sm ml-8">&mdash;</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={`w-full overflow-hidden py-2.5 bg-[#0e0e0e] border-y border-white/10 select-none relative ${className}`}>
      <div className={`flex w-max ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'} hover:[animation-play-state:paused]`}>
        {content}
        {content}
        {content}
        {content}
      </div>
    </div>
  );
};
