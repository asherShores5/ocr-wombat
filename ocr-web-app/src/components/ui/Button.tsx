// src/components/ui/Button.tsx
import React from 'react';
import { cn } from '../../lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'success';
  }
  
  export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', ...props }, ref) => {
      return (
        <button
          className={cn(
            'px-4 py-2 rounded-lg font-medium transition-all duration-150',
            variant === 'default' && 'bg-amber-500 text-gray-900 hover:bg-amber-400',
            variant === 'outline' && 'border border-gray-600 hover:border-gray-500 hover:bg-gray-800 text-gray-300',
            variant === 'success' && 'border border-emerald-600/60 bg-emerald-500/10 text-emerald-400',
            className
          )}
          ref={ref}
          {...props}
        />
      );
    }
  );
  
  Button.displayName = 'Button';