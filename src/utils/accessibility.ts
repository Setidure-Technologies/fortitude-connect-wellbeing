// Accessibility utility functions

/**
 * Announces text to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Checks if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Checks if user is using keyboard navigation
 */
export function isUsingKeyboard(): boolean {
  const lastInteraction = (window as any).lastInteraction;
  return lastInteraction === 'keyboard';
}

/**
 * Sets up keyboard/mouse interaction tracking
 */
export function setupInteractionTracking() {
  let isUsingKeyboard = false;

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      isUsingKeyboard = true;
      (window as any).lastInteraction = 'keyboard';
      document.body.classList.add('using-keyboard');
      document.body.classList.remove('using-mouse');
    }
  });

  document.addEventListener('mousedown', () => {
    isUsingKeyboard = false;
    (window as any).lastInteraction = 'mouse';
    document.body.classList.add('using-mouse');
    document.body.classList.remove('using-keyboard');
  });

  document.addEventListener('touchstart', () => {
    isUsingKeyboard = false;
    (window as any).lastInteraction = 'touch';
    document.body.classList.add('using-touch');
    document.body.classList.remove('using-keyboard', 'using-mouse');
  });
}

/**
 * Generates accessible IDs for form elements
 */
export function generateAccessibleId(prefix: string = 'accessible'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Checks if an element is visible to screen readers
 */
export function isVisibleToScreenReader(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);
  return !(
    element.hasAttribute('aria-hidden') && element.getAttribute('aria-hidden') === 'true' ||
    style.display === 'none' ||
    style.visibility === 'hidden' ||
    element.hidden
  );
}

/**
 * Gets appropriate ARIA role for an element based on its semantic meaning
 */
export function getSemanticRole(elementType: string): string | undefined {
  const roleMap: Record<string, string> = {
    'nav': 'navigation',
    'main': 'main',
    'aside': 'complementary',
    'section': 'region',
    'article': 'article',
    'header': 'banner',
    'footer': 'contentinfo'
  };
  
  return roleMap[elementType];
}

/**
 * Creates a live region for dynamic content updates
 */
export function createLiveRegion(id: string, priority: 'polite' | 'assertive' = 'polite'): HTMLElement {
  let liveRegion = document.getElementById(id);
  
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = id;
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
  }
  
  return liveRegion;
}

/**
 * Updates content in a live region
 */
export function updateLiveRegion(id: string, content: string) {
  const liveRegion = document.getElementById(id);
  if (liveRegion) {
    liveRegion.textContent = content;
  }
}