import React from 'react';
import { Check, X, AlertTriangle, Info, AlertCircle } from 'lucide-react';

export function Badge({ children, variant = 'default', size = 'md', className = '' }) {
  const variants = {
    default: 'bg-primary-100 text-primary-800 font-semibold',
    primary: 'bg-primary-600 text-white font-semibold',
    success: 'bg-green-100 text-green-800 font-semibold',
    danger: 'bg-red-100 text-red-800 font-semibold',
    warning: 'bg-amber-100 text-amber-800 font-semibold',
    info: 'bg-blue-100 text-blue-800 font-semibold',
    outline: 'bg-white/50 border border-primary-400 text-primary-800 font-semibold',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={`
        ${variants[variant]}
        ${sizes[size]}
        inline-flex items-center
        font-medium
        rounded-full
        transition-all duration-200 ease-out
        hover:scale-105 hover:shadow-sm
        ${className}
      `}
    >
      {children}
    </span>
  );
}

export function ConfidenceBadge({ confidence, className = '' }) {
  let variant = 'success';
  let label = 'High';
  
  if (confidence < 50) {
    variant = 'danger';
    label = 'Low';
  } else if (confidence < 75) {
    variant = 'warning';
    label = 'Medium';
  }

  return (
    <Badge variant={variant} size="md" className={className}>
      {confidence}% {label} Confidence
    </Badge>
  );
}

export function RiskBadge({ risk, className = '' }) {
  const riskStyles = {
    high: { variant: 'danger', icon: AlertCircle },
    medium: { variant: 'warning', icon: AlertTriangle },
    low: { variant: 'success', icon: Info },
  };

  const { variant, icon: Icon } = riskStyles[risk] || riskStyles.low;

  return (
    <Badge variant={variant} size="sm" className={`gap-1 ${className}`}>
      <Icon className="w-3 h-3" />
      {risk.charAt(0).toUpperCase() + risk.slice(1)} Risk
    </Badge>
  );
}

export function StatusBadge({ accepted, className = '' }) {
  if (accepted === null || accepted === undefined) {
    return (
      <Badge variant="outline" size="sm" className={className}>
        Pending
      </Badge>
    );
  }

  return accepted ? (
    <Badge variant="success" size="sm" className={`gap-1 ${className}`}>
      <Check className="w-3 h-3" />
      Accepted
    </Badge>
  ) : (
    <Badge variant="danger" size="sm" className={`gap-1 ${className}`}>
      <X className="w-3 h-3" />
      Rejected
    </Badge>
  );
}

export function CodeBadge({ code, className = '' }) {
  return (
    <Badge variant="outline" size="sm" className={`font-mono ${className}`}>
      {code}
    </Badge>
  );
}
