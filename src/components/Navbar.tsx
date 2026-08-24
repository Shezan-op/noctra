import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ShoppingBag, Heart, Menu, X } from 'lucide-react';
import { MobileNav } from './MobileNav';

export const Navbar: React.FC = () => {
  const { totalItems, openCart } = useCart();
  const { totalWishlist } = useWishlist();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0c0c0c]/90 backdrop-blur-md border-b border-white/10 py-3.5 shadow-2xl'
            : 'bg-[#0c0c0c]/60 backdrop-blur-sm border-b border-white/10 py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Drop indicator */}
          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="font-head text-xl sm:text-2xl font-extrabold tracking-tight text-white hover:text-white/80 transition-colors uppercase select-none"
            >
              NOCTRA
            </a>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 border border-white/20 bg-white/5 text-[9px] font-mono tracking-widest text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              DROP 01 LIVE
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-xs font-mono font-medium tracking-widest uppercase">
            <button
              onClick={() => scrollToSection('lookbook')}
              className="text-white/70 hover:text-white transition-colors flex items-center gap-0.5 group"
            >
              <span className="text-white/30 group-hover:text-white/60 mr-1">/</span>
              LOOKBOOK
            </button>
            <button
              onClick={() => scrollToSection('fabric-details')}
              className="text-white/70 hover:text-white transition-colors flex items-center gap-0.5 group"
            >
              <span className="text-white/30 group-hover:text-white/60 mr-1">/</span>
              DETAILS
            </button>
            <button
              onClick={() => scrollToSection('manifesto')}
              className="text-white/70 hover:text-white transition-colors flex items-center gap-0.5 group"
            >
              <span className="text-white/30 group-hover:text-white/60 mr-1">/</span>
              MANIFESTO
            </button>
            <button
              onClick={() => scrollToSection('vip-drop')}
              className="text-white/70 hover:text-white transition-colors flex items-center gap-0.5 group"
            >
              <span className="text-white/30 group-hover:text-white/60 mr-1">/</span>
              VIP ACCESS
            </button>
          </nav>

          {/* Actions: Wishlist + Cart + Mobile Hamburger */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Wishlist button */}
            <button
              onClick={() => scrollToSection('lookbook')}
              className="relative p-2 sm:px-3 sm:py-2 border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all text-xs font-mono tracking-wider flex items-center gap-1.5"
              title="Saved Items"
              aria-label="Wishlist"
            >
              <Heart className={`w-3.5 h-3.5 ${totalWishlist > 0 ? 'fill-red-500 text-red-500' : ''}`} />
              <span className="hidden sm:inline">SAVED</span>
              {totalWishlist > 0 && (
                <span className="ml-0.5 font-mono text-[10px] text-white bg-white/20 px-1 py-0.2">
                  {totalWishlist}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={openCart}
              className="relative p-2 sm:px-4 sm:py-2 border border-white/30 bg-white text-black hover:bg-white/90 transition-all text-xs font-head font-bold tracking-widest flex items-center gap-2 group cursor-pointer"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span>BAG</span>
              <span className="bg-black text-white px-1.5 py-0.5 text-[10px] font-mono rounded-none">
                [{totalItems}]
              </span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 border border-white/20 bg-white/5 text-white hover:bg-white/10 transition-colors focus:outline-none"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onNavigate={scrollToSection}
      />
    </>
  );
};
