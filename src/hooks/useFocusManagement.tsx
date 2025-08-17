import { useEffect, useRef, useCallback } from 'react';

interface UseFocusManagementOptions {
  restoreFocus?: boolean;
  trapFocus?: boolean;
  autoFocus?: boolean;
}

export function useFocusManagement(
  isOpen: boolean,
  options: UseFocusManagementOptions = {}
) {
  const { restoreFocus = true, trapFocus = true, autoFocus = true } = options;
  const containerRef = useRef<HTMLElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Store the previously focused element when opening
  useEffect(() => {
    if (isOpen && restoreFocus) {
      previousActiveElement.current = document.activeElement as HTMLElement;
    }
  }, [isOpen, restoreFocus]);

  // Auto-focus first focusable element when opening
  useEffect(() => {
    if (isOpen && autoFocus && containerRef.current) {
      const firstFocusable = getFocusableElements(containerRef.current)[0];
      if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 0);
      }
    }
  }, [isOpen, autoFocus]);

  // Focus trap functionality
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!trapFocus || !isOpen || !containerRef.current) return;

    if (event.key === 'Tab') {
      const focusableElements = getFocusableElements(containerRef.current);
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  }, [trapFocus, isOpen]);

  // Restore focus when closing
  useEffect(() => {
    if (!isOpen && restoreFocus && previousActiveElement.current) {
      previousActiveElement.current.focus();
      previousActiveElement.current = null;
    }
  }, [isOpen, restoreFocus]);

  // Add/remove event listeners
  useEffect(() => {
    if (isOpen && trapFocus) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, trapFocus, handleKeyDown]);

  return containerRef;
}

// Helper function to get focusable elements
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ].join(', ');

  return Array.from(container.querySelectorAll(focusableSelectors)).filter(
    (element) => {
      const htmlElement = element as HTMLElement;
      return (
        htmlElement.offsetWidth > 0 ||
        htmlElement.offsetHeight > 0 ||
        htmlElement.getClientRects().length > 0
      );
    }
  ) as HTMLElement[];
}

export default useFocusManagement;