// Simple in-memory cache implementation
// For production, consider using Redis or Memcached

interface CacheItem<T> {
  value: T;
  expiry: number; // timestamp in milliseconds
}

class InMemoryCache {
  private cache: Map<string, CacheItem<any>> = new Map();

  // Set a value in cache with optional TTL (time to live) in seconds
  set<T>(key: string, value: T, ttlSeconds?: number): void {
    const expiry = ttlSeconds ? Date.now() + (ttlSeconds * 1000) : Number.MAX_SAFE_INTEGER;
    this.cache.set(key, { value, expiry });
  }

  // Get a value from cache, returns undefined if expired or not found
  get<T>(key: string): T | undefined {
    const item = this.cache.get(key);
    
    if (!item) {
      return undefined;
    }

    // Check if expired
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return undefined;
    }

    return item.value;
  }

  // Delete a value from cache
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
  }

  // Check if a key exists and is not expired
  has(key: string): boolean {
    const item = this.cache.get(key);
    
    if (!item) {
      return false;
    }

    // Check if expired
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  // Get cache size
  size(): number {
    return this.cache.size;
  }
}

// Create a singleton instance
const cache = new InMemoryCache();

export default cache;