import React, { useState } from 'react';
import { PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';
import type { Category } from '../types';
import { SlidersHorizontal, Layers } from 'lucide-react';

export const LookbookSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'weight'>('featured');

  const categories: { label: string; value: Category }[] = [
    { label: 'ALL', value: 'all' },
    { label: 'HOODIES', value: 'hoodies' },
    { label: 'SHIRTS', value: 'shirts' },
    { label: 'PANTS', value: 'pants' },
    { label: 'TEES', value: 'tees' },
  ];

  // Filter & Sort
  const filteredProducts = PRODUCTS.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'weight') return parseInt(b.fabric.weight) - parseInt(a.fabric.weight);
    return 0;
  });

  return (
    <section id="lookbook" className="border-b border-white/10 bg-[#0c0c0c] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-6">
          <div>
            <div className="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase mb-2 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5" />
              <span>// 03. FULL RUNWAY CATALOG</span>
            </div>
            <h2 className="font-head text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white uppercase">
              LOOKBOOK <span className="font-accent italic text-white/70 font-normal">01</span>
            </h2>
            <p className="font-body text-xs sm:text-sm text-white/60 font-light mt-2 max-w-md">
              Monochrome technical pieces engineered with Japanese high-density cotton. Strictly limited batches.
            </p>
          </div>

          {/* Filter & Sort Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-2 sm:pb-0 w-full sm:w-auto -mx-4 px-4 sm:mx-0 sm:px-0">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`min-h-[44px] sm:min-h-[36px] px-3 sm:px-3.5 text-xs font-mono tracking-wider transition-all flex items-center justify-center whitespace-nowrap cursor-pointer active:scale-95 ${
                    selectedCategory === cat.value
                      ? 'bg-white text-black font-bold'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex items-center gap-2 border border-white/20 bg-white/5 px-3 min-h-[44px] sm:min-h-[36px] w-full sm:w-auto">
              <SlidersHorizontal className="w-3.5 h-3.5 text-white/40" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-mono text-white tracking-wider focus:outline-none cursor-pointer w-full uppercase"
              >
                <option value="featured" className="bg-[#121212] text-white">SORT: FEATURED</option>
                <option value="price-low" className="bg-[#121212] text-white">PRICE: LOW &rarr; HIGH</option>
                <option value="price-high" className="bg-[#121212] text-white">PRICE: HIGH &rarr; LOW</option>
                <option value="weight" className="bg-[#121212] text-white">GSM WEIGHT: HEAVIEST</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProducts.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>

        {/* Catalog Footer Info */}
        <div className="p-4 sm:p-6 border border-white/10 bg-white/5 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-white/50 gap-3 text-center sm:text-left">
          <span>SHOWING {filteredProducts.length} OF {PRODUCTS.length} SILHOUETTES</span>
          <span>ALL TEXTILES MIL-SPEC REINFORCED &bull; LIMITED RUN</span>
        </div>
      </div>
    </section>
  );
};
