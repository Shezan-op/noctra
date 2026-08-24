import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    freeShippingThreshold,
    shippingRemaining,
    hasFreeShipping,
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

    const cleanCode = promoCode.trim().toUpperCase();
    if (cleanCode === 'DROP01' || cleanCode === 'NOCTRA10') {
      setDiscountPercent(10);
      setPromoSuccess('PROMO CODE APPLIED: 10% OFF');
    } else if (cleanCode === 'VIP20') {
      setDiscountPercent(20);
      setPromoSuccess('VIP ACCESS APPLIED: 20% OFF');
    } else {
      setPromoError('INVALID CODE (TRY: DROP01)');
    }
  };

  const discountAmount = (subtotal * discountPercent) / 100;
  const shippingFee = cart.length === 0 ? 0 : hasFreeShipping ? 0 : 15;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);

      // Trigger Confetti effect
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ffffff', '#888888', '#222222'],
        });
      } catch {
        // Safe fallback
      }
    }, 1500);
  };

  const handleResetOrder = () => {
    clearCart();
    setOrderComplete(false);
    closeCart();
  };

  const shippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-[120] overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0d0d0d] border-l border-white/20 text-white flex flex-col justify-between shadow-2xl">
          {/* Drawer Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#111111]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <h2 className="font-head text-base font-extrabold tracking-wider uppercase">
                SHOPPING BAG [{totalItems}]
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-white/50 hover:text-white transition-colors"
              aria-label="Close bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          {cart.length > 0 && !orderComplete && (
            <div className="bg-[#141414] border-b border-white/10 px-5 py-3 space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono">
                {hasFreeShipping ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> YOU QUALIFY FOR FREE EXPRESS SHIPPING
                  </span>
                ) : (
                  <span className="text-white/70">
                    ADD <span className="text-white font-bold">${shippingRemaining.toFixed(0)}</span> FOR FREE SHIPPING
                  </span>
                )}
                <span className="text-white/40">{shippingProgress.toFixed(0)}%</span>
              </div>
              <div className="w-full h-1 bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-500"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Contents */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {orderComplete ? (
              <div className="py-12 text-center space-y-4 animate-fadeIn">
                <div className="w-16 h-16 bg-white text-black mx-auto flex items-center justify-center font-head text-2xl font-black">
                  ✓
                </div>
                <h3 className="font-head text-2xl font-bold uppercase">ORDER CONFIRMED</h3>
                <p className="font-mono text-xs text-white/60 max-w-xs mx-auto">
                  ORDER #NOC-{(Math.random() * 90000 + 10000).toFixed(0)} DISPATCHED TO EDITORIAL ARCHIVE.
                </p>
                <p className="font-body text-xs text-white/40">
                  Tracking instructions sent to your registered inbox.
                </p>
                <button
                  onClick={handleResetOrder}
                  className="mt-4 px-6 py-3 bg-white text-black font-head text-xs font-bold tracking-widest uppercase hover:bg-white/90"
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
                  className="px-6 py-3 border border-white/30 text-white font-mono text-xs tracking-widest hover:bg-white hover:text-black transition-all uppercase"
                >
                  EXPLORE DROP 01
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 bg-[#121212] border border-white/10 items-center justify-between"
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
                        <span className="px-1.5 py-0.2 bg-white/10 text-white font-bold border border-white/10">
                          {item.size}
                        </span>
                        <span>&bull;</span>
                        <span>${item.product.price} USD</span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-white/20 bg-white/5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-0.5 text-white/60 hover:text-white text-xs"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="px-2 text-[11px] font-mono font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-0.5 text-white/60 hover:text-white text-xs"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-white/40 hover:text-red-400 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right font-mono text-xs font-bold text-white">
                      ${item.product.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drawer Footer / Checkout Summary */}
          {cart.length > 0 && !orderComplete && (
            <div className="p-5 border-t border-white/10 bg-[#111111] space-y-4">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="PROMO CODE (DROP01)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-black border border-white/20 px-3 py-2 text-xs font-mono tracking-widest text-white uppercase placeholder:text-white/30 focus:outline-none focus:border-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 border border-white/30 text-white font-mono text-xs font-bold tracking-widest hover:bg-white hover:text-black transition-all uppercase"
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
              <div className="space-y-1.5 text-xs font-mono pt-2 border-t border-white/10 text-white/70">
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
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                  <span>ESTIMATED TOTAL:</span>
                  <span>${finalTotal.toFixed(2)} USD</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                disabled={isCheckingOut}
                onClick={handleCheckout}
                className="w-full py-4 bg-white text-black font-head text-xs font-extrabold tracking-widest uppercase hover:bg-white/90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer disabled:opacity-50"
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

              <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-white/40">
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
