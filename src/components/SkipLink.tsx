import { cn } from '@/lib/utils';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function SkipLink({ href, children, className }: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        // Hidden by default, visible when focused
        'sr-only focus:not-sr-only',
        'focus:absolute focus:top-4 focus:left-4 focus:z-50',
        'px-4 py-2 bg-primary text-primary-foreground',
        'rounded-md font-medium text-sm',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        'transition-all duration-200',
        className
      )}
      onFocus={(e) => {
        // Ensure the skip link is visible when focused
        e.currentTarget.scrollIntoView({ block: 'nearest' });
      }}
    >
      {children}
    </a>
  );
}

export default SkipLink;