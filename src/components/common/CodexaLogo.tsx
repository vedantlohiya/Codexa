import React from 'react';

interface CodexaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  layout?: 'inline' | 'stacked';
  showText?: boolean;
  lightText?: boolean;
  className?: string;
}

export const CodexaLogo: React.FC<CodexaLogoProps> = ({
  size = 'md',
  layout = 'inline',
  showText = true,
  lightText = false,
  className = '',
}) => {
  const iconDimensions = {
    sm: 'w-6 h-6',
    md: 'w-7 h-7',
    lg: 'w-9 h-9',
    xl: 'w-12 h-12',
  }[size];

  const textSize = {
    sm: 'text-sm font-bold',
    md: 'text-base font-bold',
    lg: 'text-lg font-bold tracking-tight',
    xl: 'text-2xl font-bold tracking-tight',
  }[size];

  return (
    <div
      className={`flex items-center ${
        layout === 'stacked' ? 'flex-col justify-center gap-2.5 text-center' : 'gap-2.5'
      } ${className}`}
    >
      <div
        className={`${iconDimensions} rounded-xl bg-gradient-to-br from-[#0284C7] via-[#2563EB] to-[#1D4ED8] flex items-center justify-center shadow-xs shrink-0 relative overflow-hidden`}
      >
        {/* Subtle highlight arc */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/25 pointer-events-none" />
        
        {/* Stylized code brackets and slash */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3/5 h-3/5 text-white"
        >
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
          <line x1="10" y1="19" x2="14" y2="5" />
        </svg>
      </div>

      {showText && (
        <span
          className={`${textSize} ${
            lightText ? 'text-white' : 'text-[#172033]'
          }`}
        >
          Codexa
        </span>
      )}
    </div>
  );
};
