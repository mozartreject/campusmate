import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export interface FolderCardProps {
  variant?: 'blue' | 'yellow' | 'grey' | 'lilac' | 'dark' | 'emerald' | 'amber' | 'rose';
  tag?: string;
  title?: string;
  subtitle?: string;
  metric?: string | React.ReactNode;
  metricSize?: 'lg' | 'sm';
  icon?: React.ReactNode;
  tabLabel?: string;
  tabPosition?: 'left' | 'right';
  badge?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  showTabArrow?: boolean;
}

export const FolderCard: React.FC<FolderCardProps> = ({
  variant = 'dark',
  tag,
  title,
  subtitle,
  metric,
  metricSize = 'lg',
  icon,
  tabLabel,
  tabPosition = 'right',
  badge,
  children,
  onClick,
  className = '',
  showTabArrow = true
}) => {
  // Color styling matching user's reference with high contrast accessibility
  const variantStyles = {
    blue: 'bg-[#1244E2] text-white shadow-blue-900/30 border border-blue-400/20',
    yellow: 'bg-[#FBBF24] text-slate-950 shadow-amber-950/20 border border-amber-300/30 font-medium',
    grey: 'bg-[#E5E7EB] text-slate-900 shadow-slate-900/10 border border-slate-300/40',
    lilac: 'bg-[#DDD6FE] text-slate-950 shadow-purple-900/20 border border-purple-300/30',
    dark: 'bg-[#151824] text-slate-100 border border-white/10 shadow-black/50',
    emerald: 'bg-[#065F46] text-white shadow-emerald-950/20 border border-emerald-400/30', // Deep emerald with white text for WCAG AAA contrast
    amber: 'bg-[#B45309] text-white shadow-amber-950/20 border border-amber-400/30', // Deep amber with white text for WCAG AAA contrast
    rose: 'bg-[#E11D48] text-white shadow-rose-900/20 border border-rose-400/30'
  }[variant];

  // Tab fill matching parent card color
  const tabBgColor = {
    blue: '#1244E2',
    yellow: '#FBBF24',
    grey: '#E5E7EB',
    lilac: '#DDD6FE',
    dark: '#151824',
    emerald: '#065F46',
    amber: '#B45309',
    rose: '#E11D48'
  }[variant];

  return (
    <div 
      onClick={onClick}
      className={`relative group rounded-3xl transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:-translate-y-1.5 hover:shadow-2xl' : ''
      } ${className}`}
    >
      {/* ======================================================== */}
      {/* STEPPED FOLDER TAB SVG CAP                               */}
      {/* ======================================================== */}
      <div className="relative w-full overflow-hidden">
        {tabPosition === 'right' ? (
          // Right-aligned raised tab (exact shape of ALUMNI 21, GREY & YELLOW cards in reference image)
          <div className="relative">
            <svg 
              viewBox="0 0 360 36" 
              className="w-full h-9 block -mb-[1px]" 
              preserveAspectRatio="none"
              fill={tabBgColor}
            >
              <path d="M 0,36 L 0,22 C 0,14 6,10 14,10 L 170,10 C 185,10 195,0 215,0 L 340,0 C 352,0 360,8 360,18 L 360,36 Z" />
            </svg>

            {tabLabel && (
              <div className="absolute bottom-1.5 left-4 text-[10px] font-tech font-bold tracking-widest uppercase opacity-85 pointer-events-none truncate max-w-[150px]">
                {tabLabel}
              </div>
            )}

            {showTabArrow && (
              <div className="absolute top-1.5 right-4 pointer-events-none opacity-85 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            )}
          </div>
        ) : (
          // Left-aligned raised tab
          <div className="relative">
            <svg 
              viewBox="0 0 360 36" 
              className="w-full h-9 block -mb-[1px]" 
              preserveAspectRatio="none"
              fill={tabBgColor}
            >
              <path d="M 0,36 L 0,18 C 0,8 8,0 20,0 L 145,0 C 165,0 175,10 190,10 L 346,10 C 354,10 360,14 360,22 L 360,36 Z" />
            </svg>

            {tabLabel && (
              <div className="absolute top-1.5 left-4 text-[10px] font-tech font-bold tracking-widest uppercase opacity-85 pointer-events-none truncate max-w-[140px]">
                {tabLabel}
              </div>
            )}

            {badge && (
              <div className="absolute bottom-1.5 right-4 pointer-events-none">
                <span className="text-[9px] font-tech font-bold px-2 py-0.5 rounded-full bg-black/10 opacity-90 uppercase">
                  {badge}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* MAIN FOLDER BODY                                         */}
      {/* ======================================================== */}
      <div className={`p-6 sm:p-7 rounded-b-3xl ${variantStyles} flex flex-col justify-between min-h-[160px] relative overflow-hidden`}>
        {/* Subtle decorative inner corner sheen */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10">
          {/* Header Row: Tag & optional Badge */}
          <div className="flex items-start justify-between gap-3 mb-2.5">
            {tag && (
              <span className="text-[10px] sm:text-[11px] font-tech uppercase tracking-wider font-bold opacity-85 block">
                {tag}
              </span>
            )}
            {badge && tabPosition === 'right' && (
              <span className="text-[9px] font-tech font-bold px-2 py-0.5 rounded-full bg-black/10 opacity-90 uppercase">
                {badge}
              </span>
            )}
          </div>

          {/* Title */}
          {title && (
            <h3 className="font-display text-lg sm:text-xl font-bold leading-snug line-clamp-3 sm:line-clamp-none">
              {title}
            </h3>
          )}

          {/* Subtitle */}
          {subtitle && (
            <p className="text-xs opacity-75 mt-1 leading-relaxed line-clamp-2 font-sans">
              {subtitle}
            </p>
          )}

          {children}
        </div>

        {/* Footer: Metric & Icon */}
        {metric && (
          <div className="mt-4 pt-3 flex items-center justify-between border-t border-current/15 relative z-10">
            {metricSize === 'sm' ? (
              <span className="text-xs font-tech font-bold px-2.5 py-1 rounded-lg bg-black/15 shadow-xs">
                {metric}
              </span>
            ) : (
              <div className="text-3xl sm:text-4xl font-display font-black tracking-tight">
                {metric}
              </div>
            )}
            {icon && (
              <div className="opacity-90">
                {icon}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
