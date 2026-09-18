import React from 'react';

interface FabrizLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  showTagline?: boolean;
}

export const FabrizLogo: React.FC<FabrizLogoProps> = ({
  size = 40,
  className = '',
  showText = false,
  showTagline = false
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Icon Badge */}
      <div
        style={{ width: size, height: size }}
        className="relative rounded-2xl bg-neutral-900 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-black/40 shrink-0 overflow-hidden"
      >
        <svg
          viewBox="0 0 100 100"
          className="w-[70%] h-[70%]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Vertical Stem of "F" */}
          <rect x="16" y="14" width="22" height="72" rx="4" fill="#F4F4F5" />
          {/* Top Bar of "F" */}
          <rect x="16" y="14" width="66" height="20" rx="4" fill="#F4F4F5" />
          {/* Middle Bar of "F" */}
          <rect x="16" y="45" width="42" height="18" rx="3" fill="#E4E4E7" />
          {/* Amber Focus / Awake Eye */}
          <circle cx="74" cy="54" r="13" fill="#F59E0B" />
          <circle cx="74" cy="54" r="5.5" fill="#18181B" />
        </svg>
      </div>

      {/* Typography */}
      {(showText || showTagline) && (
        <div className="flex flex-col">
          {showText && (
            <span className="font-black tracking-[0.2em] text-neutral-100 text-base leading-none">
              FABRIZ
            </span>
          )}
          {showTagline && (
            <span className="text-[10px] font-bold tracking-[0.15em] text-amber-400 mt-1 uppercase">
              Keeps You Awake
            </span>
          )}
        </div>
      )}
    </div>
  );
};
