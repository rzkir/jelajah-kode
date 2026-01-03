import { useState, useEffect, useMemo } from "react";

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

/**
 * Calculate countdown time from current time to target date
 */
function calculateCountdownTime(
  targetDate: string | null | undefined
): CountdownTime {
  if (!targetDate) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
    };
  }

  const now = new Date().getTime();
  const target = new Date(targetDate).getTime();
  const difference = target - now;

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
    };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    isExpired: false,
  };
}

/**
 * Hook to calculate countdown time until a target date
 * @param targetDate - The target date string (ISO format or date string)
 * @returns Object containing countdown time and expired status
 */
export function useCountdown(
  targetDate: string | null | undefined
): CountdownTime {
  const initialCountdown = useMemo(
    () => calculateCountdownTime(targetDate),
    [targetDate]
  );

  const [countdown, setCountdown] = useState<CountdownTime>(initialCountdown);

  useEffect(() => {
    if (!targetDate) {
      return;
    }

    // Update every second
    const interval = setInterval(() => {
      setCountdown(calculateCountdownTime(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return countdown;
}
