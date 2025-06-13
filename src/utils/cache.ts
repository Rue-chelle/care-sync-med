
// Simple in-memory cache with TTL
class SimpleCache {
  private cache = new Map<string, { value: any; expiry: number }>();

  set(key: string, value: any, ttlMs: number = 300000): void { // 5 minutes default
    const expiry = Date.now() + ttlMs;
    this.cache.set(key, { value, expiry });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.value;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

export const cache = new SimpleCache();

// Cleanup expired entries every 5 minutes
setInterval(() => cache.cleanup(), 300000);

// React Query key factory for consistent cache keys
export const queryKeys = {
  subscription: () => ['subscription'] as const,
  subscriptionStatus: () => [...queryKeys.subscription(), 'status'] as const,
  payments: () => ['payments'] as const,
  userPayments: (userId: string) => [...queryKeys.payments(), userId] as const,
  appointments: () => ['appointments'] as const,
  userAppointments: (userId: string) => [...queryKeys.appointments(), userId] as const,
  doctors: () => ['doctors'] as const,
  patients: () => ['patients'] as const,
} as const;
