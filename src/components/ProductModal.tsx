import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import type { Size, ProductSpec } from '../types';
import { X, Heart, ShoppingBag, Truck, RefreshCw, Check, Share2, Ruler } from 'lucide-react';

export const ProductModal: React.FC = () => {
  const { selectedProductForModal, closeProductModal, addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const product = selectedProductForModal;
  const [selectedSize, setSelectedSize] = useState<Size>('M');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'fabric' | 'shipping'>('specs');
  const [copiedLink, setCopiedLink] = useState(false);

  const isFavorited = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || 'M');
      setQuantity(1);
      setActiveTab('specs');
      setCopiedLink(false);
    }
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeProductModal();
    };
    if (product) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [product, closeProductModal]);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
    closeProductModal();
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={closeProductModal} />

      {/* Modal Container: Mobile Bottom Sheet & Desktop Dialog */}
      <div className="relative w-full sm:max-w-4xl bg-[#0c0c0c] border-t sm:border border-white/20 shadow-2xl z-10 flex flex-col md:flex-row max-h-[90vh] sm:max-h-[85vh] overflow-hidden rounded-t-2xl sm:rounded-none animate-in fade-in slide-in-from-bottom duration-300">
        
        {/* Mobile Drag Indicator Bar */}
        <div className="sm:hidden w-full flex justify-center pt-2.5 pb-1 cursor-grab" onClick={closeProductModal}>
          <div className="w-12 h-1 bg-white/30 rounded-full" />
        </div>

        {/* Close Button with 44px Minimum Touch Area */}
        <button
          onClick={closeProductModal}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-30 min-w-[44px] min-h-[44px] flex items-center justify-center bg-black/80 sm:bg-white/10 hover:bg-white hover:text-black text-white transition-colors border border-white/20 cursor-pointer active:scale-95"
          aria-label="Close product inspection"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Column: Image Gallery View */}
        <div className="w-full md:w-1/2 bg-[#121212] flex flex-col items-center justify-center p-6 sm:p-8 border-b md:border-b-0 md:border-r border-white/10 relative">
          <div className="relative w-full aspect-[4/5] max-h-[30vh] sm:max-h-[45vh] flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain filter-bw transition-all duration-700 hover:filter-none"
            />
          </div>

          <div className="mt-3 flex items-center justify-between w-full text-[10px] font-mono text-white/50 border-t border-white/5 pt-2">
            <span>[ HIGH-DENSITY TEXTILE ]</span>
            <span>COLOR: {product.color.toUpperCase()}</span>
          </div>
        </div>

        {/* Right Column: Technical Specs & Add to Bag */}
        <div className="w-full md:w-1/2 flex flex-col justify-between overflow-y-auto bg-[#0e0e0e]">
          <div className="p-4 sm:p-6 md:p-8 space-y-4">
            {/* Header / SKU */}
            <div className="flex items-center justify-between text-[10px] font-mono text-white/50">
              <span>[ ARCHIVE // {product.sku} ]</span>
              {product.badge && (
                <span className="px-2 py-0.5 bg-white text-black font-bold text-[9px]">
                  {product.badge}
                </span>
              )}
            </div>

            <div>
              <h2 className="font-head text-lg sm:text-2xl font-extrabold tracking-tight text-white uppercase">
                {product.name}
              </h2>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="font-mono text-base sm:text-xl font-bold text-white">${product.price} USD</span>
                {product.originalPrice && (
                  <span className="font-mono text-xs text-white/40 line-through">
                    ${product.originalPrice} USD
                  </span>
                )}
              </div>
            </div>

            <p className="font-body text-xs text-white/70 font-light leading-relaxed">
              {product.description}
            </p>

            {/* Size Selector with 44px Minimum Touch Envelope */}
            <div className="space-y-1.5 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white/70 font-semibold flex items-center gap-1">
                  <Ruler className="w-3 h-3" /> CHOOSE SIZE
                </span>
                <span className="text-white/40 text-[10px] truncate max-w-[180px]">FIT: {product.fit.split('—')[0]}</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {product.sizes.map((size: Size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-h-[44px] sm:min-h-[38px] text-xs font-mono font-bold border transition-all flex items-center justify-center cursor-pointer active:scale-95 ${
                      selectedSize === size
                        ? 'bg-white text-black border-white'
                        : 'bg-white/5 text-white/70 border-white/15 hover:border-white/50 hover:text-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector with 44px Minimum Touch Target */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-xs font-mono text-white/70">QUANTITY</span>
              <div className="flex items-center border border-white/20 bg-white/5">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="min-w-[44px] min-h-[44px] sm:min-w-[36px] sm:min-h-[32px] flex items-center justify-center text-white/70 hover:text-white text-sm cursor-pointer active:scale-95"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-3 font-mono text-xs font-bold text-white min-w-[32px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="min-w-[44px] min-h-[44px] sm:min-w-[36px] sm:min-h-[32px] flex items-center justify-center text-white/70 hover:text-white text-sm cursor-pointer active:scale-95"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Spec Tabs */}
            <div className="pt-2">
              <div className="flex border-b border-white/10 text-xs font-mono">
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`min-h-[44px] sm:min-h-[36px] flex items-center pb-1.5 px-3 tracking-wider transition-colors cursor-pointer ${
                    activeTab === 'specs'
                      ? 'border-b-2 border-white text-white font-bold'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  TECH SPECS
                </button>
                <button
                  onClick={() => setActiveTab('fabric')}
                  className={`min-h-[44px] sm:min-h-[36px] flex items-center pb-1.5 px-3 tracking-wider transition-colors cursor-pointer ${
                    activeTab === 'fabric'
                      ? 'border-b-2 border-white text-white font-bold'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  FABRIC
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`min-h-[44px] sm:min-h-[36px] flex items-center pb-1.5 px-3 tracking-wider transition-colors cursor-pointer ${
                    activeTab === 'shipping'
                      ? 'border-b-2 border-white text-white font-bold'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  SHIPPING
                </button>
              </div>

              <div className="pt-2.5 text-xs font-mono">
                {activeTab === 'specs' && (
                  <div className="space-y-1 text-white/70">
                    {product.specs.map((s: ProductSpec, i: number) => (
                      <div key={i} className="flex justify-between py-1 border-b border-white/5 text-[11px]">
                        <span className="text-white/40">{s.label}:</span>
                        <span className="text-white font-medium">{s.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'fabric' && (
                  <div className="space-y-1.5 text-white/70 text-[11px]">
                    <p><span className="text-white/40">COMPOSITION:</span> {product.fabric.material}</p>
                    <p><span className="text-white/40">DENSITY:</span> {product.fabric.weight}</p>
                    <p><span className="text-white/40">ORIGIN:</span> {product.fabric.origin}</p>
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="space-y-1.5 text-white/70 text-[11px]">
                    <p className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-emerald-400" />
                      Free express delivery over $150.
                    </p>
                    <p className="flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-white/50" />
                      14-day return window.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sticky Mobile Action Footer */}
          <div className="p-4 border-t border-white/10 sticky bottom-0 bg-[#0c0c0c] pb-[env(safe-area-inset-bottom,16px)] space-y-2">
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 min-h-[48px] bg-white text-black font-head text-xs tracking-widest uppercase font-bold hover:bg-white/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ADD TO BAG &bull; ${(product.price * quantity).toFixed(0)}</span>
              </button>

              <button
                onClick={() => toggleWishlist(product.id, product)}
                className={`min-w-[48px] min-h-[48px] border transition-colors flex items-center justify-center cursor-pointer active:scale-95 ${
                  isFavorited
                    ? 'border-red-500 bg-red-950/30 text-red-400'
                    : 'border-white/20 bg-white/5 hover:border-white text-white'
                }`}
                title={isFavorited ? 'Remove from wishlist' : 'Save item'}
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="min-w-[48px] min-h-[48px] border border-white/20 bg-white/5 hover:border-white text-white transition-colors flex items-center justify-center cursor-pointer active:scale-95"
                title="Share link"
                aria-label="Share"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>

            {copiedLink && (
              <p className="text-[10px] font-mono text-emerald-400 text-center animate-pulse">
                LINK COPIED TO CLIPBOARD
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
