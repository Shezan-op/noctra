import React, { useState, useMemo } from 'react';
import { PRODUCTS, LOOKBOOK_FILTERS } from '../data/products';
import { ProductCard } from './ProductCard';
import type { Category, SortOption } from '../types';
import { LayoutGrid, Grid3X3, ArrowUpDown } from 'lucide-react';

export const LookbookSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [gridColumns, setGridColumns] = useState<2 | 3>(2);

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // Filter by Category
    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Sort
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [activeCategory, sortBy]);

  return (
    <section id="lookbook" className="border-b border-white/10 bg-[#0c0c0c] scroll-mt-20">
      {/* Section Editorial Header */}
      <div className="border-b border-white/10 py-10 sm:py-16 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-3">
          <span className="text-[10px] sm:text-xs font-mono tracking-[0.3em] text-white/50 uppercase block">
            // DROP 01 ARCHIVE &bull; 2026 EDITION
          </span>
          <h2 className="font-head text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white uppercase">
            <span className="font-accent italic text-white/70">/</span> LOOKBOOK{' '}
            <span className="font-accent italic font-normal text-white/90">01</span>
          </h2>
          <p className="font-body text-xs sm:text-sm text-white/60 font-light max-w-md mx-auto">
            Monochromatic, architectural streetwear engineered in strictly limited batches with 450+ GSM textiles.
          </p>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="border-b border-white/10 bg-[#0e0e0e] sticky top-[65px] z-30 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Category Filter Pills (Horizontally Scrollable on Mobile) */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
            {LOOKBOOK_FILTERS.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveCategory(filter.id)}
                className={`px-3 py-1.5 text-[11px] font-mono whitespace-nowrap tracking-wider border transition-all ${
                  activeCategory === filter.id
                    ? 'bg-white text-black font-bold border-white'
                    : 'bg-transparent text-white/60 border-white/10 hover:border-white/40 hover:text-white'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Sorting & Layout Toggles */}
          <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto border-t md:border-t-0 pt-2 md:pt-0 border-white/5">
            {/* Sort Select */}
            <div className="flex items-center gap-2 text-xs font-mono text-white/60">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label="Sort products"
                className="bg-[#141414] text-white/90 border border-white/15 px-2.5 py-1 text-[11px] font-mono tracking-wider focus:outline-none focus:border-white cursor-pointer"
              >
                <option value="featured">SORT: FEATURED</option>
                <option value="price-asc">PRICE: LOW &rarr; HIGH</option>
                <option value="price-desc">PRICE: HIGH &rarr; LOW</option>
                <option value="name-asc">NAME: A &rarr; Z</option>
              </select>
            </div>

            {/* Desktop Grid Layout Switcher */}
            <div className="hidden sm:flex items-center gap-1 border border-white/10 p-0.5 bg-white/5">
              <button
                onClick={() => setGridColumns(2)}
                className={`p-1 text-xs transition-colors ${
                  gridColumns === 2 ? 'bg-white text-black' : 'text-white/40 hover:text-white'
                }`}
                title="2-Column Editorial Grid"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setGridColumns(3)}
                className={`p-1 text-xs transition-colors ${
                  gridColumns === 3 ? 'bg-white text-black' : 'text-white/40 hover:text-white'
                }`}
                title="3-Column Grid"
              >
                <Grid3X3 className="w-3.5 h-3.5" />
              </button>
            </div>

            <span className="text-[10px] font-mono text-white/40">
              [{filteredProducts.length} SILHOUETTES]
            </span>
          </div>
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {filteredProducts.length > 0 ? (
          <div
            className={`grid grid-cols-1 ${
              gridColumns === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'
            } gap-4 sm:gap-6 lg:gap-8`}
          >
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-3">
            <p className="font-mono text-sm text-white/50 uppercase">No silhouettes found</p>
            <button
              onClick={() => setActiveCategory('all')}
              className="px-4 py-2 border border-white/20 text-white font-mono text-xs hover:bg-white hover:text-black transition-all"
            >
              RESET FILTERS
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
