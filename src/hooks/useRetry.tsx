
import { useState, useCallback } from "react";

interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  onRetry?: (attempt: number) => void;
}

export const useRetry = () => {
  const [isRetrying, setIsRetrying] = useState(false);

  const executeWithRetry = useCallback(async <T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> => {
    const { maxRetries = 3, retryDelay = 1000, onRetry } = options;
    
    setIsRetrying(true);
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await fn();
        setIsRetrying(false);
        return result;
      } catch (error) {
        if (attempt === maxRetries) {
          setIsRetrying(false);
          throw error;
        }
        
        onRetry?.(attempt);
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
      }
    }
    
    throw new Error("Max retries exceeded");
  }, []);

  return { executeWithRetry, isRetrying };
};
