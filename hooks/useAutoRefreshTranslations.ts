import { useEffect, useRef } from "react";
import { useTranslation } from "./useTranslation";

interface UseAutoRefreshTranslationsOptions {
  /**
   * Interval in milliseconds to auto-refresh translations
   * Set to 0 or undefined to disable auto-refresh
   * Default: 5 minutes (300000ms)
   */
  interval?: number;
  /**
   * Enable auto-refresh
   * Default: true
   */
  enabled?: boolean;
}

/**
 * Hook untuk auto-refresh translations secara berkala
 * Berguna untuk mendapatkan update terjemahan tanpa restart aplikasi
 */
export function useAutoRefreshTranslations(
  options: UseAutoRefreshTranslationsOptions = {}
) {
  const { refreshTranslations } = useTranslation();
  const { interval = 5 * 60 * 1000, enabled = true } = options;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled || interval === 0) {
      return;
    }

    // Set up interval to refresh translations
    intervalRef.current = setInterval(() => {
      refreshTranslations();
    }, interval);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, interval, refreshTranslations]);

  return {
    refresh: refreshTranslations,
  };
}
