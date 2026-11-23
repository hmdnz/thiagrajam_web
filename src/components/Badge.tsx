import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'neutral', className = '' }) => {
  const variants = {
    primary: 'bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-700/10',
    success: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10',
    warning: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
    danger: 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/10',
    neutral: 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-500/10',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize select-none ${variants[variant]} ${className}`}
    >
      {label}
    </span>
  );
};
