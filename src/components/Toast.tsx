import React from 'react';
import { useCart } from '../context/CartContext';
import { X, CheckCircle2, ShoppingBag, Heart, AlertCircle } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toasts, removeToast, openCart } = useCart();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9990] flex flex-col gap-3 max-w-sm w-[calc(100vw-3rem)] pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#141414]/95 backdrop-blur-md border border-white/20 p-4 text-white shadow-2xl transition-all duration-300 transform translate-y-0 opacity-100 flex items-start gap-3 rounded-none"
        >
          {toast.image ? (
            <div className="w-12 h-12 bg-black/60 border border-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden">
              <img src={toast.image} alt="" className="w-full h-full object-contain p-1" />
            </div>
          ) : (
            <div className="w-9 h-9 bg-white/10 border border-white/20 flex-shrink-0 flex items-center justify-center text-white">
              {toast.type === 'cart' && <ShoppingBag className="w-4 h-4" />}
              {toast.type === 'wishlist' && <Heart className="w-4 h-4" />}
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {toast.type === 'info' && <AlertCircle className="w-4 h-4" />}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="font-head text-xs tracking-wider text-white font-bold uppercase">
                {toast.title}
              </span>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-white/40 hover:text-white transition-colors p-1"
                aria-label="Close toast"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="font-body text-xs text-white/70 mt-0.5 truncate">{toast.message}</p>
            {toast.type === 'cart' && (
              <button
                onClick={() => {
                  removeToast(toast.id);
                  openCart();
                }}
                className="mt-2 text-[10px] font-mono tracking-widest text-white/90 underline hover:text-white uppercase inline-block"
              >
                VIEW BAG &rarr;
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
