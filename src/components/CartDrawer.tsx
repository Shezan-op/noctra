import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, ArrowRight, ShieldCheck, ShoppingBag, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    freeShippingThreshold,
    hasFreeShipping,
    shippingRemaining,
    clearCart,
  } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  if (!isOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');

    const clean = promoCode.trim().toUpperCase();
    if (clean === 'DROP01' || clean === 'NOCTRA15') {
      setDiscountPercent(15);
      setPromoSuccess('15% ARCHIVE DISCOUNT APPLIED');
    } else if (clean === 'VIP20') {
      setDiscountPercent(20);
      setPromoSuccess('20% VIP ACCESS DISCOUNT APPLIED');
    } else {
      setPromoError('INVALID PROMO CODE');
    }
  };

  const discountAmount = (subtotal * discountPercent) / 100;
  const shippingFee = hasFreeShipping || cart.length === 0 ? 0 : 15;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);
      clearCart();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffffff', '#888888', '#333333'],
      });
    }, 1500);
  };

  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen sm:max-w-md bg-[#0c0c0c] border-l border-white/20 text-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#111111]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <h2 className="font-head text-sm tracking-widest uppercase font-bold">
                SHOPPING BAG [{cart.length}]
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 hover:bg-white/10 transition-colors text-white cursor-pointer active:scale-95"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="p-3 sm:p-4 bg-white/5 border-b border-white/10 text-xs font-mono">
            {!hasFreeShipping ? (
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] text-white/70">
                  <span>ADD ${shippingRemaining.toFixed(0)} FOR FREE EXPRESS SHIPPING</span>
                  <span>{progressToFreeShipping.toFixed(0)}%</span>
                </div>
                <div className="w-full h-1 bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-500"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-400 text-[11px]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>UNLOCKED: WORLDWIDE COMPLIMENTARY EXPRESS DELIVERY</span>
              </div>
            )}
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {orderComplete ? (
              <div className="py-16 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h3 className="font-head text-xl font-bold uppercase">ORDER CONFIRMED</h3>
                <p className="font-mono text-xs text-white/60 max-w-xs mx-auto">
                  Your limited Drop 01 archive pieces are being prepared at the atelier. A confirmation dispatch note has been generated.
                </p>
                <button
                  onClick={() => {
                    setOrderComplete(false);
                    closeCart();
                  }}
                  className="min-h-[44px] px-6 border border-white text-white font-mono text-xs tracking-widest hover:bg-white hover:text-black transition-all uppercase cursor-pointer"
                >
                  CONTINUE BROWSING
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-12 h-12 border border-white/20 mx-auto flex items-center justify-center text-white/40">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <p className="font-mono text-xs text-white/40 uppercase tracking-widest">
                  YOUR BAG IS CURRENTLY EMPTY
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    const el = document.getElementById('lookbook');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="min-h-[44px] px-6 border border-white/30 text-white font-mono text-xs tracking-widest hover:bg-white hover:text-black transition-all uppercase cursor-pointer flex items-center justify-center mx-auto"
                >
                  EXPLORE DROP 01
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 sm:gap-4 p-3 bg-[#121212] border border-white/10 items-center justify-between"
                  >
                    {/* Item Image */}
                    <div className="w-16 h-20 bg-black/60 border border-white/10 flex-shrink-0 flex items-center justify-center p-1">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-contain filter-bw"
                      />
                    </div>

                    {/* Meta */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-head text-xs font-bold uppercase truncate text-white">
                        {item.product.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] font-mono text-white/50">
                        <span className="px-1.5 py-0.5 bg-white/10 text-white font-bold border border-white/10">
                          {item.size}
                        </span>
                        <span>&bull;</span>
                        <span>${item.product.price} USD</span>
                      </div>

                      {/* Quantity Controls with 44px Minimum Touch Target */}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-white/20 bg-white/5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="min-w-[36px] min-h-[36px] sm:min-w-[32px] sm:min-h-[32px] flex items-center justify-center text-white/70 hover:text-white text-sm cursor-pointer active:scale-95"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="px-2 text-[11px] font-mono font-bold text-white min-w-[24px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="min-w-[36px] min-h-[36px] sm:min-w-[32px] sm:min-h-[32px] flex items-center justify-center text-white/70 hover:text-white text-sm cursor-pointer active:scale-95"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="min-w-[36px] min-h-[36px] flex items-center justify-center text-white/40 hover:text-red-400 transition-colors p-1 cursor-pointer active:scale-95"
                          title="Remove item"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right font-mono text-xs font-bold text-white flex-shrink-0">
                      ${item.product.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drawer Footer / Checkout Summary */}
          {cart.length > 0 && !orderComplete && (
            <div className="p-4 sm:p-5 border-t border-white/10 bg-[#111111] space-y-3 pb-[env(safe-area-inset-bottom,16px)]">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="PROMO CODE (DROP01)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 min-h-[44px] bg-black border border-white/20 px-3 py-2 text-base sm:text-xs font-mono tracking-widest text-white uppercase placeholder:text-white/30 focus:outline-none focus:border-white"
                />
                <button
                  type="submit"
                  className="min-h-[44px] px-4 border border-white/30 text-white font-mono text-xs font-bold tracking-widest hover:bg-white hover:text-black transition-all uppercase cursor-pointer"
                >
                  APPLY
                </button>
              </form>

              {promoSuccess && (
                <p className="text-[10px] font-mono text-emerald-400">{promoSuccess}</p>
              )}
              {promoError && (
                <p className="text-[10px] font-mono text-red-400">{promoError}</p>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1 text-xs font-mono pt-2 border-t border-white/10 text-white/70">
                <div className="flex justify-between">
                  <span>SUBTOTAL:</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>DISCOUNT ({discountPercent}%):</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>ESTIMATED SHIPPING:</span>
                  <span className="text-white">
                    {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-1.5 border-t border-white/10">
                  <span>ESTIMATED TOTAL:</span>
                  <span>${finalTotal.toFixed(2)} USD</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                disabled={isCheckingOut}
                onClick={handleCheckout}
                className="w-full min-h-[50px] bg-white text-black font-head text-xs font-extrabold tracking-widest uppercase hover:bg-white/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer disabled:opacity-50"
              >
                {isCheckingOut ? (
                  <span>AUTHENTICATING PAYMENT...</span>
                ) : (
                  <>
                    <span>SECURE CHECKOUT &bull; ${finalTotal.toFixed(2)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-white/40 pt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>256-BIT ENCRYPTED ARCHIVE CHECKOUT</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
