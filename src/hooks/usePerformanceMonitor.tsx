import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  componentName: string;
}

export function usePerformanceMonitor(componentName: string) {
  const startTime = useRef<number>(performance.now());
  const mounted = useRef<boolean>(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      const loadTime = performance.now() - startTime.current;
      
      // Log performance in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`🚀 ${componentName} loaded in ${loadTime.toFixed(2)}ms`);
      }

      // Report to analytics in production (you can integrate with your analytics service)
      if (process.env.NODE_ENV === 'production' && loadTime > 1000) {
        console.warn(`⚠️ Slow component load: ${componentName} took ${loadTime.toFixed(2)}ms`);
      }
    }
  }, [componentName]);

  useEffect(() => {
    return () => {
      if (mounted.current) {
        const totalTime = performance.now() - startTime.current;
        if (process.env.NODE_ENV === 'development') {
          console.log(`🔄 ${componentName} unmounted after ${totalTime.toFixed(2)}ms`);
        }
      }
    };
  }, [componentName]);

  const measureOperation = (operationName: string, operation: () => void) => {
    const start = performance.now();
    operation();
    const end = performance.now();
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`⚡ ${componentName}.${operationName}: ${(end - start).toFixed(2)}ms`);
    }
  };

  return { measureOperation };
}

export default usePerformanceMonitor;