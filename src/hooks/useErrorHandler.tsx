
import { useToast } from "@/hooks/use-toast";
import { useCallback } from "react";

interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  fallbackMessage?: string;
}

export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = useCallback((
    error: unknown,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      logError = true,
      fallbackMessage = "An unexpected error occurred"
    } = options;

    const errorMessage = error instanceof Error ? error.message : fallbackMessage;
    
    if (logError) {
      console.error("Error caught by error handler:", error);
    }

    if (showToast) {
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }

    return errorMessage;
  }, [toast]);

  return { handleError };
};
