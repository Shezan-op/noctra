import { useEffect, useRef, useState, useCallback, type FC, type PointerEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroCanvasProps {
  onGarmentChange?: (name: string, index: number) => void;
}

const GARMENTS = [
  { name: 'GHOST HOODIE', src: '/white-hoodie.png', ref: 'REF.01', weight: '480 GSM TERRY', fit: 'OVERSIZED BOXY' },
  { name: 'OBSIDIAN BUTTON-UP', src: '/black-shirt.png', ref: 'REF.03', weight: '220 GSM POPLIN', fit: 'ARCHITECTURAL' },
  { name: 'VOID SWEATSHIRT', src: '/sweatshirt.png', ref: 'REF.02', weight: '450 GSM FLEECE', fit: 'DROP SHOULDER' },
  { name: 'CORE HEAVY TEE', src: '/white-t-shirt.png', ref: 'REF.04', weight: '280 GSM JERSEY', fit: 'TUBULAR KNIT' },
  { name: 'COMBAT TROUSERS', src: '/pant.png', ref: 'REF.05', weight: '340 GSM RIPSTOP', fit: 'ARTICULATED' },
  { name: 'MONOLITH SHIRT', src: '/white-shirt.png', ref: 'REF.06', weight: '230 GSM BROADCLOTH', fit: 'SCULPTURAL' },
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

export const HeroCanvas: FC<HeroCanvasProps> = ({ onGarmentChange }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCanvasSupported, setIsCanvasSupported] = useState(true);
  const [morphPhase, setMorphPhase] = useState<'solid' | 'dissolving' | 'morphing' | 'solidifying'>('solid');

  const particlesRef = useRef<Particle[]>([]);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const stateRef = useRef({
    imageOpacity: 1.0, // 0 = invisible, 1 = fully solid real image
    particleOpacity: 0.0, // 0 = invisible, 1 = fully visible particles
    phase: 'solid' as 'solid' | 'dissolving' | 'morphing' | 'solidifying',
    phaseStartTime: Date.now(),
    currentIndex: 0,
    targetIndex: 0,
    autoTimer: 0,
  });

  const mouseRef = useRef<{ x: number; y: number; radius: number; active: boolean }>({
    x: -1000,
    y: -1000,
    radius: 80,
    active: false,
  });

  // Adaptive particle spacing
  const getParticleSpacing = (width: number) => {
    if (width < 640) return 12; // Mobile
    if (width < 1024) return 10; // Tablet
    return 8; // Desktop
  };

  // Helper to extract particle grid targets from an image
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
            // Ensure contrast on dark background
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

  // Initiate Morph Sequence: Solid Image -> Dissolve to Particles -> Swarm to Next Shape -> Solidify into Real Cloth
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
    state.targetIndex = nextIdx;
    state.phase = 'dissolving';
    state.phaseStartTime = performance.now();
    setMorphPhase('dissolving');

    // Shuffle targets for chaotic cool dispersion
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
        const seedX = canvas.width / 2 + (Math.random() - 0.5) * 100;
        const seedY = canvas.height / 2 + (Math.random() - 0.5) * 100;
        newParticles.push({
          x: seedX,
          y: seedY,
          originX: target.x,
          originY: target.y,
          targetX: target.x,
          targetY: target.y,
          color: target.color,
          targetColor: target.color,
          size: particleSize,
          vx: 0,
          vy: 0,
          scatterVx: Math.cos(scatterAngle) * scatterSpeed,
          scatterVy: Math.sin(scatterAngle) * scatterSpeed,
          alpha: 1,
        });
      }
    }

    if (newParticles.length > shuffledTargets.length) {
      newParticles.splice(shuffledTargets.length);
    }

    particlesRef.current = newParticles;
    setCurrentIndex(nextIdx);
    state.currentIndex = nextIdx;

    if (onGarmentChange) {
      onGarmentChange(GARMENTS[nextIdx].name, nextIdx);
    }
  }, [extractParticleTargets, onGarmentChange]);

  const nextGarment = useCallback(() => {
    const nextIdx = (currentIndex + 1) % GARMENTS.length;
    morphToGarment(nextIdx);
  }, [currentIndex, morphToGarment]);

  const prevGarment = useCallback(() => {
    const prevIdx = (currentIndex - 1 + GARMENTS.length) % GARMENTS.length;
    morphToGarment(prevIdx);
  }, [currentIndex, morphToGarment]);

  // Load all garment images
  useEffect(() => {
    let isCancelled = false;

    const loadImages = async () => {
      const promises = GARMENTS.map((g) => {
        return new Promise<HTMLImageElement | null>((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = g.src;
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
        });
      });

      const loaded = await Promise.all(promises);
      if (isCancelled) return;

      const validImages = loaded.filter((img): img is HTMLImageElement => img !== null);
      imagesRef.current = validImages;

      if (validImages.length > 0 && canvasRef.current && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        canvasRef.current.width = Math.floor(rect.width);
        canvasRef.current.height = Math.floor(rect.height);

        const initialTargets = extractParticleTargets(validImages[0], canvasRef.current.width, canvasRef.current.height);

        if (initialTargets.length > 0) {
          const particleSize = getParticleSpacing(canvasRef.current.width) * 0.8;
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
          stateRef.current.imageOpacity = 1.0;
          stateRef.current.particleOpacity = 0.0;
          stateRef.current.phase = 'solid';
          setMorphPhase('solid');
          setIsLoaded(true);
        } else {
          setIsCanvasSupported(false);
          setIsLoaded(true);
        }
      }
    };

    loadImages();

    return () => {
      isCancelled = true;
    };
  }, [extractParticleTargets]);

  // Main 60fps Animation Loop with Particle Morph & Image Solidify Illusion
  useEffect(() => {
    let animationFrameId: number;

    const render = (time: number) => {
      const canvas = canvasRef.current;
      if (!canvas || !isCanvasSupported) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const state = stateRef.current;
      const elapsed = time - state.phaseStartTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Phase State Transitions
      if (state.phase === 'dissolving') {
        // 0ms - 400ms: Image fades out, particles burst into view
        const progress = Math.min(1, elapsed / 400);
        state.imageOpacity = 1 - progress;
        state.particleOpacity = Math.min(1, progress * 1.5);

        if (progress >= 1) {
          state.phase = 'morphing';
          state.phaseStartTime = time;
          setMorphPhase('morphing');
        }
      } else if (state.phase === 'morphing') {
        // 400ms - 1800ms: Particles fly toward new garment target positions
        state.imageOpacity = 0;
        state.particleOpacity = 1;
        const progress = Math.min(1, elapsed / 1400);

        if (progress >= 1) {
          state.phase = 'solidifying';
          state.phaseStartTime = time;
          setMorphPhase('solidifying');
        }
      } else if (state.phase === 'solidifying') {
        // 1800ms - 2800ms: Particles settle, real high-res garment smoothly solidifies
        const progress = Math.min(1, elapsed / 900);
        state.imageOpacity = progress;
        state.particleOpacity = Math.max(0, 1 - progress);

        if (progress >= 1) {
          state.phase = 'solid';
          state.imageOpacity = 1.0;
          state.particleOpacity = 0.0;
          setMorphPhase('solid');
        }
      }

      // 1. Draw Real High-Res Garment Image Layer
      const currentImg = imagesRef.current[state.currentIndex];
      if (currentImg && state.imageOpacity > 0.01) {
        ctx.save();
        ctx.globalAlpha = state.imageOpacity;

        const scale = Math.min((canvas.width * 0.88) / currentImg.width, (canvas.height * 0.88) / currentImg.height);
        const w = currentImg.width * scale;
        const h = currentImg.height * scale;
        const x = (canvas.width - w) / 2;
        const y = (canvas.height - h) / 2;

        ctx.drawImage(currentImg, x, y, w, h);
        ctx.restore();
      }

      // 2. Draw Interactive Particle Morph Swarm Layer
      if (state.particleOpacity > 0.01 || state.phase !== 'solid') {
        ctx.save();
        ctx.globalAlpha = state.particleOpacity;

        const mouse = mouseRef.current;
        const particles = particlesRef.current;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          if (state.phase === 'dissolving') {
            // Scatter particles outward
            p.x += p.scatterVx;
            p.y += p.scatterVy;
            p.scatterVx *= 0.92;
            p.scatterVy *= 0.92;
          } else {
            // Converge smoothly to target
            const dx = p.targetX - p.x;
            const dy = p.targetY - p.y;
            p.vx = (p.vx + dx * 0.065) * 0.84;
            p.vy = (p.vy + dy * 0.065) * 0.84;

            // Mouse / Touch Repulsion
            if (mouse.active) {
              const mdx = p.x - mouse.x;
              const mdy = p.y - mouse.y;
              const dist = Math.sqrt(mdx * mdx + mdy * mdy);

              if (dist < mouse.radius && dist > 0) {
                const force = (1 - dist / mouse.radius) * 22;
                const angle = Math.atan2(mdy, mdx);
                p.vx += Math.cos(angle) * force;
                p.vy += Math.sin(angle) * force;
              }
            }

            p.x += p.vx;
            p.y += p.vy;
          }

          // Render Particle Block
          ctx.fillStyle = p.targetColor || p.color;
          ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        }

        ctx.restore();
      }

      // 3. Interactive Cursor Hover Particle Sparkles when Solid
      if (state.phase === 'solid' && mouseRef.current.active) {
        const mouse = mouseRef.current;
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        for (let j = 0; j < 5; j++) {
          const sparkAngle = Math.random() * Math.PI * 2;
          const sparkDist = Math.random() * mouse.radius * 0.6;
          const sx = mouse.x + Math.cos(sparkAngle) * sparkDist;
          const sy = mouse.y + Math.sin(sparkAngle) * sparkDist;
          ctx.fillRect(sx, sy, 3, 3);
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isCanvasSupported]);

  // Auto-morph timer (every 5.5 seconds)
  useEffect(() => {
    if (!isLoaded || !isCanvasSupported) return;

    const timer = setInterval(() => {
      if (stateRef.current.phase === 'solid') {
        nextGarment();
      }
    }, 5500);

    return () => clearInterval(timer);
  }, [nextGarment, isLoaded, isCanvasSupported]);

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
        /* Fallback */
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

      {/* Interactive Garment Switcher Controls at Bottom of Canvas */}
      <div className="absolute -bottom-6 sm:bottom-2 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 w-full max-w-xs sm:max-w-md px-4">
        {/* Silhouette Information Box */}
        <div className="flex items-center justify-between w-full bg-[#121212]/95 backdrop-blur-md border border-white/20 px-3 py-2 text-[10px] font-mono tracking-widest text-white shadow-2xl">
          <span className="text-white/40">{GARMENTS[currentIndex].ref}</span>
          <div className="text-center px-2 truncate">
            <span className="font-bold uppercase block">{GARMENTS[currentIndex].name}</span>
            <span className="text-[8px] text-white/50 block tracking-normal">{GARMENTS[currentIndex].weight} &bull; {GARMENTS[currentIndex].fit}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={prevGarment}
              className="p-1 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer"
              aria-label="Previous Garment"
              title="Previous Silhouette"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextGarment}
              className="p-1 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer"
              aria-label="Next Garment"
              title="Next Silhouette"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Thumbnail / Indicator Dots */}
        <div className="flex items-center gap-1.5">
          {GARMENTS.map((g, idx) => (
            <button
              key={g.ref}
              onClick={() => morphToGarment(idx)}
              className={`h-1.5 transition-all duration-500 rounded-none cursor-pointer ${
                idx === currentIndex
                  ? 'w-7 bg-white shadow-md'
                  : 'w-2 bg-white/30 hover:bg-white/70'
              }`}
              title={`Morph to ${g.name}`}
              aria-label={`Morph to ${g.name}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
