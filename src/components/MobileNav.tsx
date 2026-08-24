import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, ArrowRight } from 'lucide-react';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (id: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose, onNavigate }) => {
  const { totalItems, openCart } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 md:hidden bg-[#0c0c0c]/98 backdrop-blur-2xl flex flex-col justify-between pt-24 pb-8 px-6 transition-all duration-300">
      {/* Navigation list */}
      <div className="flex flex-col space-y-6">
        <div className="border-b border-white/10 pb-4 flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-[0.3em] text-white/50 uppercase">
            // INDEX DIRECTORY
          </span>
          <span className="text-[10px] font-mono tracking-widest text-emerald-400">
            ONLINE
          </span>
        </div>

        <nav className="flex flex-col space-y-4">
          <button
            onClick={() => onNavigate('lookbook')}
            className="flex items-center justify-between text-left py-2 text-2xl font-head tracking-tight text-white hover:text-white/70 border-b border-white/5 group"
          >
            <span>LOOKBOOK 01</span>
            <ArrowRight className="w-5 h-5 text-white/40 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onNavigate('solution')}
            className="flex items-center justify-between text-left py-2 text-2xl font-head tracking-tight text-white hover:text-white/70 border-b border-white/5 group"
          >
            <span>COMBAT TROUSERS</span>
            <ArrowRight className="w-5 h-5 text-white/40 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onNavigate('fabric-details')}
            className="flex items-center justify-between text-left py-2 text-2xl font-head tracking-tight text-white hover:text-white/70 border-b border-white/5 group"
          >
            <span>450 GSM SPECS</span>
            <ArrowRight className="w-5 h-5 text-white/40 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onNavigate('manifesto')}
            className="flex items-center justify-between text-left py-2 text-2xl font-head tracking-tight text-white hover:text-white/70 border-b border-white/5 group"
          >
            <span>MANIFESTO</span>
            <ArrowRight className="w-5 h-5 text-white/40 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onNavigate('vip-drop')}
            className="flex items-center justify-between text-left py-2 text-2xl font-head tracking-tight text-white hover:text-white/70 border-b border-white/5 group"
          >
            <span>VIP ACCESS</span>
            <ArrowRight className="w-5 h-5 text-white/40 group-hover:translate-x-1 transition-transform" />
          </button>
        </nav>
      </div>

      {/* Bottom status & actions */}
      <div className="flex flex-col space-y-4 pt-6 border-t border-white/10">
        <button
          onClick={() => {
            onClose();
            openCart();
          }}
          className="w-full py-4 bg-white text-black font-head text-sm tracking-widest uppercase flex items-center justify-center gap-3 font-bold active:scale-[0.99] transition-transform"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>VIEW SHOPPING BAG [{totalItems}]</span>
        </button>

        <div className="grid grid-cols-2 gap-3 text-[11px] font-mono text-white/50 pt-2">
          <div className="p-3 border border-white/10 bg-white/5">
            <span className="block text-white font-bold mb-0.5">DROP 01</span>
            <span>SHIPS WORLDWIDE</span>
          </div>
          <div className="p-3 border border-white/10 bg-white/5">
            <span className="block text-white font-bold mb-0.5">FREE RETURNS</span>
            <span>14-DAY WINDOW</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-white/40 pt-2">
          <span>© 2026 NOCTRA ARCHIVE</span>
          <span>CURRENCY: USD ($)</span>
        </div>
      </div>
    </div>
  );
};
