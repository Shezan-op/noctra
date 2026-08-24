import { useEffect } from 'react';
import Lenis from 'lenis';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { Preloader } from './components/Preloader';
import { CustomCursor } from './components/CustomCursor';
import { Toast } from './components/Toast';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AgitationSection } from './components/AgitationSection';
import { SolutionSection } from './components/SolutionSection';
import { LookbookSection } from './components/LookbookSection';
import { FabricDetailSection } from './components/FabricDetailSection';
import { SplitSection } from './components/SplitSection';
import { ManifestoSection } from './components/ManifestoSection';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';

export function App() {
  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.8,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <CartProvider>
      <WishlistProvider>
        <div className="relative min-h-screen bg-[#0c0c0c] text-[#f4f4f4] flex flex-col selection:bg-white selection:text-black">
          {/* Splash screen / Preloader */}
          <Preloader />

          {/* Custom reactive cursor */}
          <CustomCursor />

          {/* Floating toasts */}
          <Toast />

          {/* Fixed navigation */}
          <Navbar />

          {/* Main content flow */}
          <main className="flex-1 w-full overflow-hidden">
            <Hero />
            <AgitationSection />
            <SolutionSection />
            <LookbookSection />
            <FabricDetailSection />
            <SplitSection />
            <ManifestoSection />
            <NewsletterSection />
          </main>

          {/* Footer */}
          <Footer />

          {/* Modals & Slide-out Drawers */}
          <ProductModal />
          <CartDrawer />
        </div>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;
