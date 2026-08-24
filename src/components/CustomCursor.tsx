import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [followerPos, setFollowerPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check for touch / mobile
    const checkTouch = () => {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    };

    if (checkTouch()) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target?.closest('a') ||
        target?.closest('button') ||
        target?.closest('input') ||
        target?.closest('select') ||
        target?.closest('.cursor-pointer') ||
        target?.closest('[role="button"]')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  // Smooth lag for follower
  useEffect(() => {
    if (isTouchDevice) return;
    let animationFrameId: number;

    const smoothFollower = () => {
      setFollowerPos((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        return {
          x: prev.x + dx * 0.18,
          y: prev.y + dy * 0.18,
        };
      });
      animationFrameId = requestAnimationFrame(smoothFollower);
    };

    animationFrameId = requestAnimationFrame(smoothFollower);
    return () => cancelAnimationFrame(animationFrameId);
  }, [position, isTouchDevice]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <>
      {/* Precision center dot */}
      <div
        className="fixed pointer-events-none z-[9999] rounded-full bg-white transition-transform duration-75 mix-blend-difference"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isHovering ? '6px' : '8px',
          height: isHovering ? '6px' : '8px',
          transform: `translate(-50%, -50%) scale(${isClicking ? 0.7 : 1})`,
        }}
      />
      {/* Smooth outer follower ring */}
      <div
        className={`fixed pointer-events-none z-[9998] rounded-full transition-all duration-300 ease-out border ${
          isHovering
            ? 'border-white/80 bg-white/10 scale-125'
            : 'border-white/30 bg-transparent scale-100'
        }`}
        style={{
          left: `${followerPos.x}px`,
          top: `${followerPos.y}px`,
          width: isHovering ? '54px' : '36px',
          height: isHovering ? '54px' : '36px',
          transform: `translate(-50%, -50%) scale(${isClicking ? 0.85 : 1})`,
        }}
      />
    </>
  );
};
