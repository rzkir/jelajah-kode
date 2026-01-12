import { showRateLimitToast } from "@/components/ui/rate-limit-toast";

/**
 * Handle rate limit errors from API responses with countdown timer
 * @param response - Fetch Response object
 * @param defaultMessage - Default error message if rate limit info is not available
 * @returns true if it was a rate limit error, false otherwise
 */
export async function handleRateLimitError(
  response: Response,
  defaultMessage: string = "Terlalu banyak permintaan. Silakan coba lagi nanti."
): Promise<boolean> {
  if (response.status !== 429) {
    return false;
  }

  try {
    const data = await response.json();
    const retryAfter = data.retryAfter || response.headers.get("Retry-After");
    const resetTime = response.headers.get("X-RateLimit-Reset");

    const message = data.error || defaultMessage;

    // Calculate reset time
    let resetDate: Date | null = null;

    if (resetTime) {
      try {
        resetDate = new Date(resetTime);
        // Validate date
        if (isNaN(resetDate.getTime())) {
          resetDate = null;
        }
      } catch {
        resetDate = null;
      }
    }

    // If we have retryAfter but no resetTime, calculate reset time
    if (!resetDate && retryAfter) {
      const seconds = parseInt(retryAfter, 10);
      if (!isNaN(seconds) && seconds > 0) {
        resetDate = new Date(Date.now() + seconds * 1000);
      }
    }

    // If we have a valid reset date, show toast with timer
    if (resetDate) {
      showRateLimitToast(resetDate, message);
    } else {
      // Fallback to regular toast if we can't calculate reset time
      const { toast } = await import("sonner");
      toast.error(message, {
        duration: 5000,
      });
    }

    return true;
  } catch {
    // If parsing fails, show default message
    const { toast } = await import("sonner");
    toast.error(defaultMessage, {
      duration: 5000,
    });
    return true;
  }
}

/**
 * Extract rate limit information from response headers
 */
export function getRateLimitInfo(response: Response) {
  return {
    limit: response.headers.get("X-RateLimit-Limit"),
    remaining: response.headers.get("X-RateLimit-Remaining"),
    reset: response.headers.get("X-RateLimit-Reset"),
    retryAfter: response.headers.get("Retry-After"),
  };
}
