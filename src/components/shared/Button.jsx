import React from 'react';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  glow = false,
  ...props
}) {
  const variants = {
    primary: `
      bg-primary-500 text-white
      hover:bg-primary-400
      focus:ring-primary-300
      disabled:bg-primary-300
    `,
    secondary: `
      bg-primary-100/50 text-primary-700
      hover:bg-primary-100
      focus:ring-primary-200
      border border-primary-300/50
    `,
    ghost: `
      bg-transparent text-primary-700
      hover:bg-primary-100/50
      focus:ring-primary-200
    `,
    success: `
      bg-green-500 text-white
      hover:bg-green-400
      focus:ring-green-300
    `,
    danger: `
      bg-red-500 text-white
      hover:bg-red-400
      focus:ring-red-300
    `,
    outline: `
      bg-transparent text-primary-500
      border-2 border-primary-500
      hover:bg-primary-500 hover:text-white
      focus:ring-primary-300
    `,
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };

  return (
    <button
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${glow ? 'glow-primary animate-pulse-glow' : ''}
        inline-flex items-center justify-center gap-2
        font-medium
        rounded-xl
        transition-all duration-300 ease-out
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        hover:shadow-lg hover:-translate-y-0.5
        active:translate-y-0 active:shadow-md
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-5 h-5 animate-spin" />}
      {!loading && Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
    </button>
  );
}

export function IconButton({
  icon: Icon,
  variant = 'ghost',
  size = 'md',
  className = '',
  ...props
}) {
  const variants = {
    primary: 'bg-primary-500 text-white hover:bg-primary-400',
    ghost: 'bg-transparent text-primary-600 hover:bg-primary-100/50',
    success: 'bg-green-500/20 text-green-600 hover:bg-green-500/30',
    danger: 'bg-red-500/20 text-red-600 hover:bg-red-500/30',
  };

  const sizes = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-lg
        transition-all duration-200 ease-out
        focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-1
        hover:scale-110 hover:shadow-md
        active:scale-100
        ${className}
      `}
      {...props}
    >
      <Icon className={iconSizes[size]} />
    </button>
  );
}
