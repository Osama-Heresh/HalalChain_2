import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ScrollableTabNavProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'light' | 'dark' | 'auto';
  showMoreIndicator?: boolean;
}

export const ScrollableTabNav: React.FC<ScrollableTabNavProps> = ({
  children,
  className = '',
  variant = 'light',
  showMoreIndicator = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 3);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => checkScroll());
      resizeObserver.observe(el);
      (Array.from(el.children) as Element[]).forEach((child) => resizeObserver?.observe(child));
    }

    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
      resizeObserver?.disconnect();
    };
  }, [checkScroll, children]);

  const scroll = (direction: 'left' | 'right') => {
    const el = containerRef.current;
    if (!el) return;
    const scrollAmount = Math.max(200, Math.floor(el.clientWidth * 0.65));
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const isDark = variant === 'dark';
  const fadeLeftClass = isDark
    ? 'bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent'
    : 'bg-gradient-to-r from-slate-50 via-slate-50/90 to-transparent';
  const fadeRightClass = isDark
    ? 'bg-gradient-to-l from-slate-900 via-slate-900/80 to-transparent'
    : 'bg-gradient-to-l from-slate-50 via-slate-50/90 to-transparent';

  const buttonClass = isDark
    ? 'bg-slate-800 text-amber-400 hover:bg-slate-700 hover:text-amber-300 border-slate-700 shadow-lg'
    : 'bg-white text-slate-800 hover:bg-slate-100 hover:text-amber-600 border-slate-200 shadow-md';

  return (
    <div className={`relative group/tabnav flex items-center min-w-0 ${className}`}>
      {/* Scroll Left Button */}
      {canScrollLeft && (
        <div className={`absolute left-0 top-0 bottom-0 z-20 flex items-center pr-4 pl-0.5 pointer-events-none ${fadeLeftClass}`}>
          <button
            type="button"
            onClick={() => scroll('left')}
            className={`pointer-events-auto p-1.5 rounded-full border transition-all cursor-pointer hover:scale-110 active:scale-95 ${buttonClass}`}
            title="Scroll left"
            aria-label="Scroll left menu options"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Scrollable Content */}
      <div
        ref={containerRef}
        className="flex items-center gap-2 overflow-x-auto scrollbar-none scroll-smooth w-full touch-pan-x py-1"
      >
        {children}
      </div>

      {/* Scroll Right Button & Overflow Indicator */}
      {canScrollRight && (
        <div className={`absolute right-0 top-0 bottom-0 z-20 flex items-center pl-4 pr-0.5 pointer-events-none ${fadeRightClass}`}>
          <button
            type="button"
            onClick={() => scroll('right')}
            className={`pointer-events-auto p-1.5 rounded-full border transition-all cursor-pointer hover:scale-110 active:scale-95 flex items-center gap-1 ${buttonClass}`}
            title="More menu options available →"
            aria-label="Scroll right menu options"
          >
            <ChevronRight className="w-4 h-4 animate-pulse text-amber-500" />
            {showMoreIndicator && (
              <span className="text-[10px] font-bold font-mono uppercase tracking-wider hidden sm:inline px-1 text-amber-500">
                More
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
