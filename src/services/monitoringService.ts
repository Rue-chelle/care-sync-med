import { productionConfig } from "@/config/production";

export interface ErrorEvent {
  message: string;
  stack?: string;
  url?: string;
  userId?: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface PerformanceEvent {
  action: string;
  duration: number;
  url?: string;
  userId?: string;
  timestamp: Date;
}

export class MonitoringService {
  private static isEnabled = productionConfig.MONITORING.ERROR_TRACKING;

  static logError(error: ErrorEvent) {
    if (!this.isEnabled) return;

    console.error('[MONITORING] Error:', error);
    
    // In production, this would send to your error tracking service
    // Example integrations:
    // - Sentry: Sentry.captureException(error)
    // - LogRocket: LogRocket.captureException(error)
    // - Custom API: fetch('/api/errors', { method: 'POST', body: JSON.stringify(error) })
    
    // For now, we'll log to console and could store in local storage for debugging
    if (typeof window !== 'undefined') {
      const errors = JSON.parse(localStorage.getItem('app_errors') || '[]');
      errors.push(error);
      // Keep only last 50 errors to prevent storage bloat
      if (errors.length > 50) {
        errors.splice(0, errors.length - 50);
      }
      localStorage.setItem('app_errors', JSON.stringify(errors));
    }
  }

  static logPerformance(event: PerformanceEvent) {
    if (!productionConfig.MONITORING.PERFORMANCE_MONITORING) return;

    console.log('[MONITORING] Performance:', event);
    
    // In production, send to analytics service
    // Example: analytics.track('performance_event', event)
  }

  static logUserAction(action: string, details: any = {}) {
    if (!productionConfig.MONITORING.USER_ANALYTICS) return;

    console.log('[MONITORING] User Action:', { action, ...details });
    
    // In production, send to analytics service
    // Example: analytics.track(action, details)
  }

  static async healthCheck(): Promise<boolean> {
    try {
      // Check database connectivity
      const { error } = await fetch(`${process.env.SUPABASE_URL}/rest/v1/`, {
        method: 'HEAD',
        headers: {
          'apikey': process.env.SUPABASE_ANON_KEY || '',
        }
      });

      if (error) {
        this.logError({
          message: 'Health check failed - database connectivity',
          severity: 'critical',
          timestamp: new Date()
        });
        return false;
      }

      return true;
    } catch (error) {
      this.logError({
        message: 'Health check exception',
        stack: error instanceof Error ? error.stack : String(error),
        severity: 'critical',
        timestamp: new Date()
      });
      return false;
    }
  }

  // Get stored errors for debugging
  static getStoredErrors(): ErrorEvent[] {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('app_errors') || '[]');
  }

  // Clear stored errors
  static clearStoredErrors() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('app_errors');
    }
  }
}

// Global error handler
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    MonitoringService.logError({
      message: event.message,
      stack: event.error?.stack,
      url: event.filename,
      severity: 'medium',
      timestamp: new Date()
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    MonitoringService.logError({
      message: `Unhandled Promise Rejection: ${event.reason}`,
      severity: 'high',
      timestamp: new Date()
    });
  });
}
