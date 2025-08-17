import { forwardRef } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface AccessibleButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  focusRingColor?: 'primary' | 'destructive' | 'secondary';
}

const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ 
    children, 
    isLoading = false, 
    loadingText = 'Loading...',
    ariaLabel,
    ariaDescribedBy,
    focusRingColor = 'primary',
    disabled,
    className,
    ...props 
  }, ref) => {
    const focusRingClasses = {
      primary: 'focus-visible:ring-primary',
      destructive: 'focus-visible:ring-destructive',
      secondary: 'focus-visible:ring-secondary',
    };

    return (
      <Button
        ref={ref}
        disabled={disabled || isLoading}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-busy={isLoading}
        className={cn(
          'focus-visible:ring-2 focus-visible:ring-offset-2 transition-all duration-200',
          focusRingClasses[focusRingColor],
          isLoading && 'cursor-not-allowed',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="sr-only">{loadingText}</span>
            {loadingText}
          </div>
        ) : (
          children
        )}
      </Button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';

export { AccessibleButton };
export default AccessibleButton;