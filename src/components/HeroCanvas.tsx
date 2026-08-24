import { useEffect, useRef, useState, useCallback, type FC, type PointerEvent } from 'react';
import { ChevronLeft, ChevronRight, Eye, ShoppingBag } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';

interface HeroCanvasProps {
  onGarmentChange?: (name: string, index: number) => void;
  controlledIndex?: number;
}

export const GARMENTS = [
  { name: 'GHOST HOODIE', src: '/white-hoodie.png', ref: 'REF.01', weight: '480 GSM TERRY', fit: 'OVERSIZED BOXY', price: 120, productId: 'ghost-hoodie' },
  { name: 'OBSIDIAN BUTTON-UP', src: '/black-shirt.png', ref: 'REF.03', weight: '220 GSM POPLIN', fit: 'ARCHITECTURAL', price: 140, productId: 'obsidian-button-up' },
  { name: 'VOID SWEATSHIRT', src: '/sweatshirt.png', ref: 'REF.02', weight: '450 GSM FLEECE', fit: 'DROP SHOULDER', price: 95, productId: 'void-sweatshirt' },
  { name: 'CORE HEAVY TEE', src: '/white-t-shirt.png', ref: 'REF.04', weight: '280 GSM JERSEY', fit: 'TUBULAR KNIT', price: 45, productId: 'core-tee' },
  { name: 'COMBAT TROUSERS', src: '/pant.png', ref: 'REF.05', weight: '340 GSM RIPSTOP', fit: 'ARTICULATED', price: 165, productId: 'combat-trousers' },
  { name: 'MONOLITH SHIRT', src: '/white-shirt.png', ref: 'REF.06', weight: '230 GSM BROADCLOTH', fit: 'SCULPTURAL', price: 130, productId: 'monolith-shirt' },
];

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  targetX: number;
  targetY: number;
  color: string;
  targetColor: string;
  size: number;
  vx: number;
  vy: number;
  scatterVx: number;
  scatterVy: number;
  alpha: number;
}

export const HeroCanvas: FC<HeroCanvasProps> = ({ onGarmentChange, controlledIndex }) => {
  const { openProductModal, addToCart } = useCart();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  
  const [isCanvasSupported, setIsCanvasSupported] = useState(true);
  const [morphPhase, setMorphPhase] = useState<'solid' | 'dissolving' | 'morphing' | 'solidifying'>('solid');

  const particlesRef = useRef<Particle[]>([]);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const stateRef = useRef({
    currentIndex: 0,
    targetIndex: 0,
    morphProgress: 1,
    imageOpacity: 1,
    particleOpacity: 0,
    phase: 'solid' as 'solid' | 'dissolving' | 'morphing' | 'solidifying',
    phaseStartTime: 0,
  });

  const mouseRef = useRef({
    x: -1000,
    y: -1000,
    radius: 80,
    active: false,
  });

  const getParticleSpacing = (width: number) => {
    if (width < 640) return 12;
    if (width < 1024) return 10;
    return 8;
  };

  const extractParticleTargets = useCallback((img: HTMLImageElement, canvasWidth: number, canvasHeight: number) => {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvasWidth;
    tempCanvas.height = canvasHeight;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return [];

    const spacing = getParticleSpacing(canvasWidth);
    const scale = Math.min((canvasWidth * 0.88) / img.width, (canvasHeight * 0.88) / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    const xOffset = (canvasWidth - w) / 2;
    const yOffset = (canvasHeight - h) / 2;

    tempCtx.drawImage(img, xOffset, yOffset, w, h);

    try {
      const imgData = tempCtx.getImageData(0, 0, canvasWidth, canvasHeight);
      const data = imgData.data;
      const targets: { x: number; y: number; color: string }[] = [];

      for (let y = 0; y < canvasHeight; y += spacing) {
        for (let x = 0; x < canvasWidth; x += spacing) {
          const index = (y * canvasWidth + x) * 4;
          const alpha = data[index + 3];

          if (alpha > 90) {
            let r = data[index];
            let g = data[index + 1];
            let b = data[index + 2];
            if (r < 35 && g < 35 && b < 35) {
              r = 50;
              g = 50;
              b = 50;
            }

            targets.push({
              x: x + (Math.random() - 0.5) * 2,
              y: y + (Math.random() - 0.5) * 2,
              color: `rgb(${r}, ${g}, ${b})`,
            });
          }
        }
      }
      return targets;
    } catch {
      return [];
    }
  }, []);

  const morphToGarment = useCallback((nextIdx: number) => {
    if (!canvasRef.current || imagesRef.current.length === 0) return;
    const canvas = canvasRef.current;
    const nextImg = imagesRef.current[nextIdx];
    if (!nextImg) return;

    const targets = extractParticleTargets(nextImg, canvas.width, canvas.height);
    if (targets.length === 0) {
      setIsCanvasSupported(false);
      return;
    }

    const state = stateRef.current;
    if (state.phase !== 'solid' && state.targetIndex === nextIdx) return;
    
    state.targetIndex = nextIdx;
    state.phase = 'dissolving';
    state.phaseStartTime = performance.now();
    setMorphPhase('dissolving');

    const shuffledTargets = [...targets].sort(() => Math.random() - 0.5);
    const currentParticles = particlesRef.current;
    const maxCount = Math.max(currentParticles.length, shuffledTargets.length);
    const particleSize = getParticleSpacing(canvas.width) * 0.8;

    const newParticles: Particle[] = [];

    for (let i = 0; i < maxCount; i++) {
      const target = shuffledTargets[i % shuffledTargets.length];
      const scatterAngle = Math.random() * Math.PI * 2;
      const scatterSpeed = 8 + Math.random() * 18;

      if (i < currentParticles.length) {
        const p = currentParticles[i];
        p.targetX = target.x;
        p.targetY = target.y;
        p.targetColor = target.color;
        p.scatterVx = Math.cos(scatterAngle) * scatterSpeed;
        p.scatterVy = Math.sin(scatterAngle) * scatterSpeed;
        p.alpha = 1;
        newParticles.push(p);
      } else {
        const spawnAngle = Math.random() * Math.PI * 2;
        const spawnDist = 40 + Math.random() * 120;
        const sx = canvas.width / 2 + Math.cos(spawnAngle) * spawnDist;
        const sy = canvas.height / 2 + Math.sin(spawnAngle) * spawnDist;

        newParticles.push({
          x: sx,
          y: sy,
          originX: sx,
          originY: sy,
          targetX: target.x,
          targetY: target.y,
          color: target.color,
          targetColor: target.color,
          size: particleSize,
          vx: 0,
          vy: 0,
          scatterVx: Math.cos(scatterAngle) * scatterSpeed,
          scatterVy: Math.sin(scatterAngle) * scatterSpeed,
          alpha: 0.8,
        });
      }
    }

    particlesRef.current = newParticles;
    setCurrentIndex(nextIdx);
    if (onGarmentChange) {
      onGarmentChange(GARMENTS[nextIdx].name, nextIdx);
    }
  }, [extractParticleTargets, onGarmentChange]);

  // Sync with controlled index from vertical scroll
  useEffect(() => {
    if (controlledIndex !== undefined && controlledIndex >= 0 && controlledIndex < GARMENTS.length) {
      if (controlledIndex !== currentIndex) {
        morphToGarment(controlledIndex);
      }
    }
  }, [controlledIndex, currentIndex, morphToGarment]);

  const nextGarment = useCallback(() => {
    const next = (currentIndex + 1) % GARMENTS.length;
    morphToGarment(next);
  }, [currentIndex, morphToGarment]);

  const prevGarment = useCallback(() => {
    const prev = (currentIndex - 1 + GARMENTS.length) % GARMENTS.length;
    morphToGarment(prev);
  }, [currentIndex, morphToGarment]);

  // Preload images
  useEffect(() => {
    let active = true;

    const loadImages = async () => {
      const loaded: HTMLImageElement[] = [];

      for (let i = 0; i < GARMENTS.length; i++) {
        const img = new Image();
        img.src = GARMENTS[i].src;
        img.crossOrigin = 'anonymous';

        await new Promise<void>((resolve) => {
          img.onload = () => {
            loaded[i] = img;
            resolve();
          };
          img.onerror = () => {
            console.warn(`Could not load ${GARMENTS[i].src}`);
            resolve();
          };
        });
      }

      if (!active) return;
      imagesRef.current = loaded;

      if (containerRef.current && canvasRef.current && loaded.length > 0) {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        const rect = container.getBoundingClientRect();

        canvas.width = Math.max(300, Math.floor(rect.width || window.innerWidth * 0.45));
        canvas.height = Math.max(300, Math.floor(rect.height || window.innerHeight * 0.55));

        const initialTargets = extractParticleTargets(loaded[0], canvas.width, canvas.height);

        if (initialTargets.length > 0) {
          const particleSize = getParticleSpacing(canvas.width) * 0.8;
          particlesRef.current = initialTargets.map((t) => ({
            x: t.x,
            y: t.y,
            originX: t.x,
            originY: t.y,
            targetX: t.x,
            targetY: t.y,
            color: t.color,
            targetColor: t.color,
            size: particleSize,
            vx: 0,
            vy: 0,
            scatterVx: 0,
            scatterVy: 0,
            alpha: 1,
          }));

          stateRef.current.phase = 'solid';
          stateRef.current.imageOpacity = 1;
          stateRef.current.particleOpacity = 0;
          setIsCanvasSupported(true);
        } else {
          setIsCanvasSupported(false);
        }
      }

      
    };

    loadImages();

    return () => {
      active = false;
    };
  }, [extractParticleTargets]);

  // 60 FPS loop
  useEffect(() => {
    if (!isCanvasSupported) return;

    let animationFrameId: number;

    const render = (time: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const state = stateRef.current;
      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const currentImage = imagesRef.current[state.currentIndex];
      const targetImage = imagesRef.current[state.targetIndex];

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const elapsed = time - state.phaseStartTime;

      if (state.phase === 'dissolving') {
        const dissolveDuration = 400;
        const p = Math.min(1, elapsed / dissolveDuration);
        state.imageOpacity = 1 - p;
        state.particleOpacity = Math.min(1, p * 1.5);

        if (p >= 1) {
          state.phase = 'morphing';
          state.phaseStartTime = time;
          setMorphPhase('morphing');
        }
      } else if (state.phase === 'morphing') {
        const swarmDuration = 750;
        const p = Math.min(1, elapsed / swarmDuration);
        state.imageOpacity = 0;
        state.particleOpacity = 1;

        if (p >= 1) {
          state.phase = 'solidifying';
          state.phaseStartTime = time;
          state.currentIndex = state.targetIndex;
          setMorphPhase('solidifying');
        }
      } else if (state.phase === 'solidifying') {
        const solidifyDuration = 600;
        const p = Math.min(1, elapsed / solidifyDuration);
        state.imageOpacity = p;
        state.particleOpacity = Math.max(0, 1 - p * 1.2);

        if (p >= 1) {
          state.phase = 'solid';
          state.imageOpacity = 1;
          state.particleOpacity = 0;
          setMorphPhase('solid');
        }
      }

      // Draw real garment photo
      if (state.imageOpacity > 0.01 && (targetImage || currentImage)) {
        const imgToDraw = state.phase === 'dissolving' ? currentImage : (targetImage || currentImage);
        if (imgToDraw) {
          ctx.save();
          ctx.globalAlpha = state.imageOpacity;

          const scale = Math.min((canvas.width * 0.88) / imgToDraw.width, (canvas.height * 0.88) / imgToDraw.height);
          const w = imgToDraw.width * scale;
          const h = imgToDraw.height * scale;
          const x = (canvas.width - w) / 2;
          const y = (canvas.height - h) / 2;

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
          ctx.shadowBlur = 30;
          ctx.shadowOffsetY = 15;

          ctx.drawImage(imgToDraw, x, y, w, h);
          ctx.restore();
        }
      }

      // Draw dynamic particles
      if (state.particleOpacity > 0.01 || mouse.active) {
        ctx.save();
        ctx.globalAlpha = state.particleOpacity;

        const isDissolving = state.phase === 'dissolving';
        const isMorphing = state.phase === 'morphing';
        const isSolidifying = state.phase === 'solidifying';

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          if (isDissolving) {
            p.x += p.scatterVx * 0.45;
            p.y += p.scatterVy * 0.45;
            p.scatterVx *= 0.92;
            p.scatterVy *= 0.92;
          } else if (isMorphing || isSolidifying) {
            const dx = p.targetX - p.x;
            const dy = p.targetY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const spring = isMorphing ? 0.08 : 0.16;
            const damping = 0.82;

            p.vx = (p.vx + dx * spring) * damping;
            p.vy = (p.vy + dy * spring) * damping;

            p.x += p.vx;
            p.y += p.vy;

            if (dist < 10) {
              p.color = p.targetColor;
            }
          }

          if (mouse.active) {
            const mdx = p.x - mouse.x;
            const mdy = p.y - mouse.y;
            const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

            if (mDist < mouse.radius && mDist > 0) {
              const force = (1 - mDist / mouse.radius) * 12;
              p.x += (mdx / mDist) * force;
              p.y += (mdy / mDist) * force;
            }
          }

          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }

        ctx.restore();
      }

      // Micro spark
      if (state.phase === 'solid' && mouse.active) {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        for (let i = 0; i < 6; i++) {
          const sparkAngle = (time * 0.003 + (i * Math.PI) / 3);
          const sx = mouse.x + Math.cos(sparkAngle) * 25;
          const sy = mouse.y + Math.sin(sparkAngle) * 25;
          ctx.fillRect(sx, sy, 3, 3);
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isCanvasSupported]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        canvasRef.current.width = Math.floor(rect.width);
        canvasRef.current.height = Math.floor(rect.height);
        morphToGarment(currentIndex);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentIndex, morphToGarment]);

  // Mouse & Touch interaction
  const handlePointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
    mouseRef.current.active = true;
    mouseRef.current.radius = window.innerWidth < 640 ? 60 : 90;
  };

  const handlePointerLeave = () => {
    mouseRef.current.active = false;
    mouseRef.current.x = -1000;
    mouseRef.current.y = -1000;
  };

  const currentProduct = PRODUCTS.find((p) => p.id === GARMENTS[currentIndex].productId) || PRODUCTS[0];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center select-none group"
    >
      {isCanvasSupported ? (
        <canvas
          ref={canvasRef}
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className="w-full h-full block cursor-grab active:cursor-grabbing touch-none z-10"
        />
      ) : (
        <div className="relative w-full h-full flex items-center justify-center p-6">
          <img
            src={GARMENTS[currentIndex].src}
            alt={GARMENTS[currentIndex].name}
            className="w-full h-full object-contain filter-bw transition-opacity duration-700 max-h-[65vh]"
          />
        </div>
      )}

      {/* Morph Status Indicator Pill */}
      <div className="absolute top-2 right-2 sm:right-6 z-20 pointer-events-none">
        <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md border border-white/15 px-3 py-1 text-[9px] font-mono tracking-widest text-white/80">
          <span className={`w-1.5 h-1.5 rounded-full ${morphPhase === 'solid' ? 'bg-emerald-400' : 'bg-white animate-ping'}`} />
          <span>
            {morphPhase === 'solid'
              ? 'FORM RESOLVED // 100% SOLID'
              : morphPhase === 'solidifying'
              ? 'SOLIDIFYING INTO CLOTH...'
              : 'PARTICLE MORPH ACTIVE'}
          </span>
        </div>
      </div>

      {/* Interactive Controls at Bottom of Canvas */}
      <div className="absolute -bottom-6 sm:bottom-2 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 w-full max-w-xs sm:max-w-md px-4">
        {/* Silhouette Information Box */}
        <div className="flex items-center justify-between w-full bg-[#121212]/95 backdrop-blur-md border border-white/20 px-3 py-2 text-[10px] font-mono tracking-widest text-white shadow-2xl">
          <span className="text-white/40">{GARMENTS[currentIndex].ref}</span>
          <div className="text-center px-2 truncate">
            <span className="font-bold text-white uppercase">{GARMENTS[currentIndex].name}</span>
            <span className="text-white/40 block text-[9px]">
              {GARMENTS[currentIndex].weight} &bull; {GARMENTS[currentIndex].fit}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={prevGarment}
              aria-label="Previous garment"
              className="p-1 border border-white/20 hover:bg-white hover:text-black transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={nextGarment}
              aria-label="Next garment"
              className="p-1 border border-white/20 hover:bg-white hover:text-black transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Modal Inspect & Add to Cart */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => openProductModal(currentProduct)}
            className="px-3 py-1.5 bg-white/10 hover:bg-white hover:text-black text-white text-[10px] font-mono tracking-wider flex items-center gap-1.5 transition-all border border-white/20"
          >
            <Eye className="w-3 h-3" />
            <span>INSPECT SPECS</span>
          </button>
          <button
            onClick={() => addToCart(currentProduct, 'M')}
            className="px-3 py-1.5 bg-white text-black hover:bg-white/90 text-[10px] font-mono font-bold tracking-wider flex items-center gap-1.5 transition-all"
          >
            <ShoppingBag className="w-3 h-3" />
            <span>QUICK ADD (${GARMENTS[currentIndex].price})</span>
          </button>
        </div>

        {/* Morph Index Indicator Bars */}
        <div className="flex items-center gap-1.5 pt-1">
          {GARMENTS.map((g, idx) => (
            <button
              key={idx}
              onClick={() => morphToGarment(idx)}
              aria-label={`Morph to ${g.name}`}
              className={`h-1 transition-all rounded-none ${
                currentIndex === idx ? 'w-6 bg-white' : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
