// src/components/ui/Button.tsx
import React from 'react';
import { cn } from '../../lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline';
  }
  
  export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', ...props }, ref) => {
      return (
        <button
          className={cn(
            'px-4 py-2 rounded font-medium transition-colors',
            variant === 'default' && 'bg-blue-600 text-white hover:bg-blue-700',
            variant === 'outline' && 'border border-gray-600 hover:bg-gray-800 text-gray-200',
            className
          )}
          ref={ref}
          {...props}
        />
      );
    }
  );
  
  Button.displayName = 'Button';