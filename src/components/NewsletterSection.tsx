import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !email.includes('@') || !email.includes('.')) {
      setErrorMsg('PLEASE ENTER A VALID EMAIL ADDRESS');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 800);
  };

  const scrollToLookbook = () => {
    const el = document.getElementById('lookbook');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="vip-drop" className="border-b border-white/10 bg-[#0c0c0c] py-20 sm:py-28 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8">
        <div className="space-y-3">
          <span className="text-[10px] sm:text-xs font-mono tracking-[0.3em] text-white/50 uppercase block">
            // DROP 01 IS LIVE &bull; DROP 02 ALLOCATION
          </span>
          <h2 className="font-head text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white uppercase leading-[0.9]">
            IT WON'T <br />
            <span className="font-accent italic text-white/80 font-normal">wait for you</span>.
          </h2>
          <p className="font-body text-xs sm:text-sm text-white/60 font-light max-w-md mx-auto">
            All silhouettes are produced in numbered, non-restocked drops. Sign up for 1-hour priority access to Drop 02 and private lookbook previews.
          </p>
        </div>

        {/* Action Button: Jump to Lookbook */}
        <div className="pt-2">
          <button
            onClick={scrollToLookbook}
            className="inline-flex items-center gap-3 px-8 sm:px-12 py-4 sm:py-5 border border-white text-white bg-transparent hover:bg-white hover:text-black transition-all duration-300 rounded-full font-head text-xs sm:text-sm font-bold tracking-widest uppercase group cursor-pointer shadow-2xl"
          >
            <span>ENTER STORE &bull; SHOP DROP 01</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>

        {/* VIP Access Email Form */}
        <div className="max-w-md mx-auto pt-8 border-t border-white/10">
          <span className="block font-mono text-[10px] text-white/40 tracking-widest uppercase mb-3">
            PRIVATE VIP EARLY ACCESS PASS
          </span>

          {isSuccess ? (
            <div className="p-4 border border-emerald-500/40 bg-emerald-950/30 text-emerald-400 font-mono text-xs flex items-center justify-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" />
              <span>ACCESS GRANTED: WELCOME TO THE ARCHIVE.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="ENTER YOUR EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-[#121212] border border-white/20 px-4 py-3 text-xs font-mono tracking-wider text-white placeholder:text-white/30 focus:outline-none focus:border-white uppercase"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-white text-black font-head text-xs font-bold tracking-widest uppercase hover:bg-white/90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'ENROLLING...' : 'ENROLL'}
              </button>
            </form>
          )}

          {errorMsg && (
            <p className="mt-2 text-[10px] font-mono text-red-400 text-left">{errorMsg}</p>
          )}

          <div className="mt-4 flex items-center justify-center gap-4 text-[10px] font-mono text-white/40">
            <span>NO SPAM</span>
            <span>&bull;</span>
            <span>ONLY DROP NOTIFICATIONS</span>
            <span>&bull;</span>
            <span>INSTANT UNSUBSCRIBE</span>
          </div>
        </div>
      </div>
    </section>
  );
};
