import React from 'react';

export const IslamicPatternBg: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden ${className}`}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="islamic-star-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 52 28 L 80 40 L 52 52 L 40 80 L 28 52 L 0 40 L 28 28 Z"
              fill="none"
              stroke="#D97706"
              strokeWidth="1"
            />
            <circle cx="40" cy="40" r="12" fill="none" stroke="#059669" strokeWidth="0.75" />
            <rect x="25" y="25" width="30" height="30" fill="none" stroke="#1C2541" strokeWidth="0.5" transform="rotate(45 40 40)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-star-pattern)" />
      </svg>
    </div>
  );
};

export const GoldFiligreeLine: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center my-4 ${className}`}>
      <div className="h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent w-full max-w-md relative">
        <div className="absolute left-1/2 -top-[5px] -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-amber-500 border border-amber-300 shadow-sm" />
      </div>
    </div>
  );
};
