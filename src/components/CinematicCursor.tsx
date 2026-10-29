import React, { useEffect, useState, useRef } from 'react';

interface FrameRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const CinematicCursor: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isFraming, setIsFraming] = useState(false);
  const [isButtonOrAction, setIsButtonOrAction] = useState(false);

  const frameRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const currentFrame = useRef<FrameRect>({ x: -100, y: -100, width: 28, height: 28 });
  const targetFrame = useRef<FrameRect>({ x: -100, y: -100, width: 28, height: 28 });
  const hoveredElRef = useRef<HTMLElement | null>(null);
  const isFramingRef = useRef(false);
  const isButtonRef = useRef(false);
  const animFrameId = useRef<number | null>(null);
  const isTouchRef = useRef(false);

  useEffect(() => {
    // 1. Check touch devices - disable custom cursor completely on touch/mobile
    const isTouch =
      window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0;

    isTouchRef.current = isTouch;
    if (isTouch) return;

    // 2. Check reduced-motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    setMounted(true);

    // Target element detector
    const updateTarget = (target: HTMLElement | null) => {
      if (!target) {
        hoveredElRef.current = null;
        if (isFramingRef.current) {
          isFramingRef.current = false;
          setIsFraming(false);
        }
        if (isButtonRef.current) {
          isButtonRef.current = false;
          setIsButtonOrAction(false);
        }
        return;
      }

      // Explicitly exclude inputs, textareas, and code editors from reticle framing so native caret remains clean
      if (target.closest('input, textarea, select, [contenteditable="true"], .monaco-editor, .cursor-text')) {
        hoveredElRef.current = null;
        if (isFramingRef.current) {
          isFramingRef.current = false;
          setIsFraming(false);
        }
        if (isButtonRef.current) {
          isButtonRef.current = false;
          setIsButtonOrAction(false);
        }
        return;
      }

      // Check for buttons, clickable cards, links, tabs, and interactive elements
      const interactiveEl = target.closest(
        'button, [role="button"], a, [data-cursor-target], .btn-cinematic, .btn-cinematic-secondary, .btn-cinematic-accent, .card-cinematic, .interactive-card, [tabindex="0"]'
      ) as HTMLElement | null;

      if (interactiveEl && !interactiveEl.hasAttribute('disabled')) {
        const rect = interactiveEl.getBoundingClientRect();
        // Frame elements within reasonable viewport bounds
        if (rect.width >= 12 && rect.width <= 900 && rect.height >= 12 && rect.height <= 550) {
          hoveredElRef.current = interactiveEl;
          const isBtn = Boolean(
            interactiveEl.matches('button, [role="button"], a, .btn-cinematic, .btn-cinematic-secondary, .btn-cinematic-accent')
          );

          if (isButtonRef.current !== isBtn) {
            isButtonRef.current = isBtn;
            setIsButtonOrAction(isBtn);
          }

          if (!isFramingRef.current) {
            isFramingRef.current = true;
            setIsFraming(true);
          }

          const pad = isBtn ? 6 : 8;
          targetFrame.current = {
            x: rect.left - pad,
            y: rect.top - pad,
            width: rect.width + pad * 2,
            height: rect.height + pad * 2,
          };
          return;
        }
      }

      hoveredElRef.current = null;
      if (isFramingRef.current) {
        isFramingRef.current = false;
        setIsFraming(false);
      }
      if (isButtonRef.current) {
        isButtonRef.current = false;
        setIsButtonOrAction(false);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      setVisible(true);
      updateTarget(e.target as HTMLElement | null);
    };

    const onScrollOrResize = () => {
      if (hoveredElRef.current) {
        const rect = hoveredElRef.current.getBoundingClientRect();
        const pad = isButtonRef.current ? 6 : 8;
        targetFrame.current = {
          x: rect.left - pad,
          y: rect.top - pad,
          width: rect.width + pad * 2,
          height: rect.height + pad * 2,
        };
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setVisible(false);
    const onMouseEnter = () => setVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Smooth Lerp Animation Loop (runs cleanly once mounted, never leaks)
    const renderLoop = () => {
      if (!hoveredElRef.current) {
        // Free-roaming cursor reticle
        targetFrame.current = {
          x: mousePos.current.x - 14,
          y: mousePos.current.y - 14,
          width: 28,
          height: 28,
        };
      }

      // Smooth interpolation
      const lerpFactor = hoveredElRef.current ? 0.35 : 0.45;
      currentFrame.current.x += (targetFrame.current.x - currentFrame.current.x) * lerpFactor;
      currentFrame.current.y += (targetFrame.current.y - currentFrame.current.y) * lerpFactor;
      currentFrame.current.width += (targetFrame.current.width - currentFrame.current.width) * lerpFactor;
      currentFrame.current.height += (targetFrame.current.height - currentFrame.current.height) * lerpFactor;

      if (frameRef.current) {
        const f = currentFrame.current;
        frameRef.current.style.transform = `translate3d(${f.x}px, ${f.y}px, 0)`;
        frameRef.current.style.width = `${f.width}px`;
        frameRef.current.style.height = `${f.height}px`;
      }

      animFrameId.current = requestAnimationFrame(renderLoop);
    };

    animFrameId.current = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  if (!mounted || isTouchRef.current) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[999999] transition-opacity duration-150 print:hidden ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* 
        CAMERA AUTOFOCUS RETICLE
        Lightweight cinematic corner brackets that snugly frame hovered action items
      */}
      <div
        ref={frameRef}
        className={`fixed top-0 left-0 pointer-events-none will-change-transform transition-[border-color,box-shadow,transform] duration-100 ease-out ${
          isClicking ? 'scale-[0.97]' : 'scale-100'
        }`}
        style={{
          width: '28px',
          height: '28px',
          transform: 'translate3d(-100px, -100px, 0)',
        }}
      >
        {/* Subtle camera focus illumination ring when framing an active button */}
        {isFraming && (
          <div className="absolute inset-0 rounded-xl bg-indigo-500/[0.04] dark:bg-cyan-400/[0.06] transition-opacity duration-200 pointer-events-none" />
        )}

        {/* 1. Top-Left Corner: Curved L-bracket */}
        <span
          className={`absolute top-0 left-0 rounded-tl-[8px] border-t-[2px] border-l-[2px] transition-all duration-150 ${
            isFraming
              ? isButtonOrAction
                ? 'w-3.5 h-3.5 border-[#4F46E5] dark:border-cyan-400 shadow-[0_0_8px_rgba(79,70,229,0.5)] dark:shadow-[0_0_10px_rgba(6,182,212,0.6)]'
                : 'w-3.5 h-3.5 border-[#4F46E5]/70 dark:border-cyan-400/70'
              : 'w-2 h-2 border-[#4F46E5] dark:border-cyan-400'
          }`}
        />

        {/* 2. Top-Right Corner: Curved L-bracket */}
        <span
          className={`absolute top-0 right-0 rounded-tr-[8px] border-t-[2px] border-r-[2px] transition-all duration-150 ${
            isFraming
              ? isButtonOrAction
                ? 'w-3.5 h-3.5 border-[#4F46E5] dark:border-cyan-400 shadow-[0_0_8px_rgba(79,70,229,0.5)] dark:shadow-[0_0_10px_rgba(6,182,212,0.6)]'
                : 'w-3.5 h-3.5 border-[#4F46E5]/70 dark:border-cyan-400/70'
              : 'w-2 h-2 border-[#4F46E5] dark:border-cyan-400'
          }`}
        />

        {/* 3. Bottom-Left Corner: Curved L-bracket */}
        <span
          className={`absolute bottom-0 left-0 rounded-bl-[8px] border-b-[2px] border-l-[2px] transition-all duration-150 ${
            isFraming
              ? isButtonOrAction
                ? 'w-3.5 h-3.5 border-[#4F46E5] dark:border-cyan-400 shadow-[0_0_8px_rgba(79,70,229,0.5)] dark:shadow-[0_0_10px_rgba(6,182,212,0.6)]'
                : 'w-3.5 h-3.5 border-[#4F46E5]/70 dark:border-cyan-400/70'
              : 'w-2 h-2 border-[#4F46E5] dark:border-cyan-400'
          }`}
        />

        {/* 4. Bottom-Right Corner: Curved L-bracket */}
        <span
          className={`absolute bottom-0 right-0 rounded-br-[8px] border-b-[2px] border-r-[2px] transition-all duration-150 ${
            isFraming
              ? isButtonOrAction
                ? 'w-3.5 h-3.5 border-[#4F46E5] dark:border-cyan-400 shadow-[0_0_8px_rgba(79,70,229,0.5)] dark:shadow-[0_0_10px_rgba(6,182,212,0.6)]'
                : 'w-3.5 h-3.5 border-[#4F46E5]/70 dark:border-cyan-400/70'
              : 'w-2 h-2 border-[#4F46E5] dark:border-cyan-400'
          }`}
        />

        {/* 5. Center Camera Reticle Pip */}
        <span
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-150 ${
            isFraming
              ? 'w-1 h-1 bg-[#4F46E5]/60 dark:bg-cyan-400/60'
              : 'w-1.5 h-1.5 bg-[#4F46E5] dark:bg-cyan-400 shadow-[0_0_6px_rgba(79,70,229,0.7)]'
          }`}
        />
      </div>
    </div>
  );
};
