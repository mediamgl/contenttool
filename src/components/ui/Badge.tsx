import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'info' | 'warning' | 'danger';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'primary', className = '', ...props }) => {
  return (
    <span
      className={`badge badge-${variant} ${className}`.trim()}
      {...props}
    />
  );
};

Badge.displayName = 'Badge';
