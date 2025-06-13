
import { useEffect, useRef } from "react";

interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
}

export const usePerformanceMonitor = (componentName: string) => {
  const startTime = useRef<number>();
  const renderCount = useRef(0);

  useEffect(() => {
    startTime.current = performance.now();
    renderCount.current += 1;
  });

  useEffect(() => {
    if (startTime.current) {
      const endTime = performance.now();
      const renderTime = endTime - startTime.current;
      
      if (renderTime > 16) { // Warn if render takes longer than one frame (16ms)
        console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
      }
      
      // Log performance metrics in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} - Render #${renderCount.current}: ${renderTime.toFixed(2)}ms`);
      }
    }
  });

  return {
    renderCount: renderCount.current,
    logMetric: (metricName: string, value: number) => {
      console.log(`${componentName} - ${metricName}: ${value}`);
    }
  };
};
