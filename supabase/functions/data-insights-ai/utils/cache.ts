
// Cache management utilities
export class InsightsCache {
  private static cache = new Map<string, any>();
  private static readonly MAX_CACHE_SIZE = 50;

  static get(key: string): any | null {
    return this.cache.get(key) || null;
  }

  static set(key: string, value: any): void {
    this.cache.set(key, value);
    
    // Clean up old entries if cache is too large
    if (this.cache.size > this.MAX_CACHE_SIZE) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }

  static has(key: string): boolean {
    return this.cache.has(key);
  }

  static generateCacheKey(oem: string, country: string, dashboardMetrics: any, isMarketOverview: boolean): string {
    const analysisType = isMarketOverview ? 'market-overview' : oem;
    return `vehicle-segment-insights-${analysisType}-${country || 'global'}-${JSON.stringify(dashboardMetrics).slice(0, 50)}`;
  }
}
