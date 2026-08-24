import React, { useState } from 'react';
import type { Product, Size } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Eye, ShoppingBag, Heart, ArrowUpRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  index: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const { openProductModal, addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState<Size>(product.sizes[0] || 'M');
  const isFavorited = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedSize);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id, product);
  };

  return (
    <div
      className="group relative flex flex-col bg-[#0f0f0f] border border-white/10 hover:border-white/30 transition-all duration-300 overflow-hidden"
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between p-3 border-b border-white/5 bg-[#0c0c0c]/80 text-[10px] font-mono tracking-widest text-white/50 z-10">
        <span>[ 0{index + 1} // {product.sku} ]</span>
        <div className="flex items-center gap-2">
          {product.badge && (
            <span className="px-1.5 py-0.5 bg-white/10 text-white font-bold text-[9px] uppercase border border-white/15">
              {product.badge}
            </span>
          )}
          <button
            onClick={handleWishlistClick}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center p-2 hover:text-white transition-colors cursor-pointer"
            title={isFavorited ? 'Remove from Saved' : 'Save Item'}
            aria-label="Toggle Wishlist"
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorited ? 'fill-red-500 text-red-500' : 'text-white/60 hover:text-white'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Image Area */}
      <div
        onClick={() => openProductModal(product)}
        className="relative w-full aspect-[4/5] bg-black/40 overflow-hidden cursor-pointer flex items-center justify-center p-6 sm:p-8"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain filter-bw transition-all duration-700 group-hover:scale-105 group-hover:filter-none"
          loading="lazy"
        />

        {/* Quick View Overlay on Desktop */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openProductModal(product);
            }}
            className="px-4 py-2.5 bg-white text-black font-head text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 hover:bg-white/90 shadow-xl transition-transform transform translate-y-2 group-hover:translate-y-0 duration-300 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>QUICK VIEW</span>
          </button>
        </div>

        {/* Color Badge */}
        <span className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-2 py-0.5 text-[9px] font-mono text-white/70 border border-white/10">
          {product.color}
        </span>
      </div>

      {/* Details & Quick Add Section */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 border-t border-white/10 bg-[#0e0e0e] space-y-3 sm:space-y-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3
              onClick={() => openProductModal(product)}
              className="font-head text-sm sm:text-lg font-bold tracking-tight text-white uppercase hover:text-white/80 transition-colors cursor-pointer"
            >
              {product.name}
            </h3>
            <div className="text-right flex-shrink-0">
              <span className="font-mono text-sm sm:text-base font-bold text-white">${product.price}</span>
              {product.originalPrice && (
                <span className="block font-mono text-[10px] text-white/40 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
          </div>
          <p className="font-body text-xs text-white/50 font-light mt-1 line-clamp-2">
            {product.tagline}
          </p>
        </div>

        {/* Size Selection Pill List */}
        <div className="space-y-2 pt-2 border-t border-white/5">
          <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
            <span>SELECT SIZE</span>
            <span>{product.fabric.weight}</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`min-w-[34px] h-7 sm:min-w-[28px] sm:h-6 px-2 text-[11px] sm:text-[10px] font-mono font-semibold flex items-center justify-center border transition-all cursor-pointer ${
                  selectedSize === size
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent text-white/60 border-white/15 hover:border-white/40 hover:text-white'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Action Buttons (44px Minimum Touch Envelope on Mobile) */}
          <div className="pt-2 flex gap-2">
            <button
              onClick={handleQuickAdd}
              className="flex-1 min-h-[44px] sm:min-h-[38px] bg-white/10 hover:bg-white text-white hover:text-black font-head text-[11px] font-bold tracking-widest uppercase border border-white/20 hover:border-white transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>ADD TO BAG</span>
            </button>
            <button
              onClick={() => openProductModal(product)}
              className="min-w-[44px] min-h-[44px] sm:min-w-[38px] sm:min-h-[38px] border border-white/15 hover:border-white text-white/70 hover:text-white transition-colors flex items-center justify-center active:scale-98 cursor-pointer"
              title="Inspect Piece"
              aria-label="Inspect Piece"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
