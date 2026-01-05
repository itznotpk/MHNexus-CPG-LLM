import React from 'react';

export function GlassCard({ children, className = '', variant = 'default', ...props }) {
  const variants = {
    default: 'bg-white/40 border-white/30',
    dark: 'bg-primary-900/90 border-white/10 text-white',
    light: 'bg-white/60 border-white/40',
    success: 'bg-green-50/80 border-green-400/40',
    danger: 'bg-red-50/80 border-red-400/40',
    warning: 'bg-amber-50/80 border-amber-400/40',
  };

  return (
    <div
      className={`
        ${variants[variant]}
        backdrop-blur-xl
        border
        rounded-2xl
        shadow-lg
        transition-all
        duration-300
        hover:shadow-xl
        hover:border-white/30
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export function GlassPanel({ children, className = '', ...props }) {
  return (
    <div
      className={`
        bg-white/20
        backdrop-blur-lg
        border
        border-white/20
        rounded-3xl
        shadow-xl
        p-6
        transition-all
        duration-300
        hover:shadow-2xl
        hover:bg-white/25
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
