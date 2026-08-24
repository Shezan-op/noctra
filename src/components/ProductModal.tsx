import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import type { Size } from '../types';
import { X, ShoppingBag, Heart, Truck, RefreshCw, Share2, Check } from 'lucide-react';

export const ProductModal: React.FC = () => {
  const { selectedProductForModal, closeProductModal, addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const product = selectedProductForModal;

  const [selectedSize, setSelectedSize] = useState<Size>('M');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'fabric' | 'shipping'>('specs');

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || 'M');
      setQuantity(1);
      setSelectedImageIndex(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeProductModal();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [product, closeProductModal]);

  if (!product) return null;

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div
      onClick={closeProductModal}
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
    >
      {/* Modal Box */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl max-h-[92vh] bg-[#0d0d0d] border border-white/20 text-white flex flex-col md:flex-row overflow-hidden shadow-2xl rounded-none"
      >
        {/* Close Button */}
        <button
          onClick={closeProductModal}
          className="absolute top-3 right-3 z-30 p-2 bg-black/80 border border-white/20 text-white/80 hover:text-white hover:bg-white hover:text-black transition-all"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left: Gallery & Preview */}
        <div className="w-full md:w-1/2 p-5 sm:p-6 bg-[#111111] border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between overflow-y-auto">
          <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-white/50 mb-3">
            <span>[ GALLERY // {product.sku} ]</span>
            <span>IMAGE 0{selectedImageIndex + 1} OF 0{product.gallery.length || 1}</span>
          </div>

          {/* Main Display Image */}
          <div className="relative w-full aspect-square max-h-[40vh] md:max-h-[46vh] bg-black/50 border border-white/10 flex items-center justify-center p-4 overflow-hidden group">
            <img
              src={product.gallery[selectedImageIndex] || product.image}
              alt={product.name}
              className="w-full h-full object-contain filter-bw group-hover:filter-none transition-all duration-500 scale-95 group-hover:scale-100"
            />
            <span className="absolute bottom-2.5 left-2.5 bg-black/80 px-2 py-0.5 text-[9px] font-mono text-white/70 border border-white/10">
              {product.color}
            </span>
          </div>

          {/* Thumbnail Strip */}
          {product.gallery.length > 1 && (
            <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-12 h-12 sm:w-14 sm:h-14 bg-black border p-1 transition-all flex-shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-white ring-1 ring-white'
                      : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Specifications, Sizing, Add to Bag */}
        <div className="w-full md:w-1/2 p-5 sm:p-6 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-[92vh] space-y-4">
          <div className="space-y-3.5">
            {/* Header / Badges */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-widest text-white/60 uppercase">
                {product.category} &bull; DROP 01
              </span>
              {product.badge && (
                <span className="px-2 py-0.5 bg-white/10 text-white font-mono text-[9px] uppercase border border-white/20">
                  {product.badge}
                </span>
              )}
            </div>

            <div>
              <h2 className="font-head text-xl sm:text-2xl font-extrabold tracking-tight text-white uppercase">
                {product.name}
              </h2>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="font-mono text-lg sm:text-xl font-bold text-white">${product.price} USD</span>
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

            {/* Size Selector */}
            <div className="space-y-1.5 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white/70 font-semibold">CHOOSE SIZE</span>
                <span className="text-white/40 text-[10px] truncate max-w-[200px]">FIT: {product.fit.split('—')[0]}</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 text-xs font-mono font-bold border transition-all ${
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

            {/* Quantity Selector */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-xs font-mono text-white/70">QUANTITY</span>
              <div className="flex items-center border border-white/20 bg-white/5">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2.5 py-1 text-white/60 hover:text-white text-xs"
                >
                  -
                </button>
                <span className="px-2.5 py-1 font-mono text-xs font-bold text-white min-w-[28px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2.5 py-1 text-white/60 hover:text-white text-xs"
                >
                  +
                </button>
              </div>
            </div>

            {/* Spec Tabs: Specs, Fabric, Shipping */}
            <div className="pt-2">
              <div className="flex border-b border-white/10 text-xs font-mono">
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`pb-1.5 px-2.5 tracking-wider transition-colors ${
                    activeTab === 'specs'
                      ? 'border-b-2 border-white text-white font-bold'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  TECH SPECS
                </button>
                <button
                  onClick={() => setActiveTab('fabric')}
                  className={`pb-1.5 px-2.5 tracking-wider transition-colors ${
                    activeTab === 'fabric'
                      ? 'border-b-2 border-white text-white font-bold'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  FABRIC
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`pb-1.5 px-2.5 tracking-wider transition-colors ${
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
                    {product.specs.map((s, i) => (
                      <div key={i} className="flex justify-between py-0.5 border-b border-white/5 text-[11px]">
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

          {/* Action Footer */}
          <div className="space-y-2 pt-3 border-t border-white/10 sticky bottom-0 bg-[#0d0d0d] pb-1">
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 bg-white text-black font-head text-xs tracking-widest uppercase font-bold hover:bg-white/90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ADD TO BAG &bull; ${(product.price * quantity).toFixed(0)}</span>
              </button>

              <button
                onClick={() => toggleWishlist(product.id, product)}
                className={`p-3.5 border transition-colors flex items-center justify-center ${
                  isFavorited
                    ? 'border-red-500 bg-red-950/30 text-red-400'
                    : 'border-white/20 bg-white/5 hover:border-white text-white'
                }`}
                title={isFavorited ? 'Remove from wishlist' : 'Save item'}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="p-3.5 border border-white/20 bg-white/5 hover:border-white text-white transition-colors flex items-center justify-center"
                title="Share link"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>

            {copiedLink && (
              <p className="text-[10px] font-mono text-emerald-400 text-center animate-pulse">
                URL COPIED TO CLIPBOARD
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
