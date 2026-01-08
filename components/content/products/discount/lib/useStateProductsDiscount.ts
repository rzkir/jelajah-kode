"use client";

import { useEffect, useState, useMemo } from "react";

export function useStateProductsDiscount(
  productsDiscount: ProductsDiscountResponse
) {
  const productsArray = useMemo(
    () => (Array.isArray(productsDiscount.data) ? productsDiscount.data : []),
    [productsDiscount.data]
  );

  const earliestEndDate = useMemo(() => {
    const dates = productsArray
      .map((item) => item.discount?.until)
      .filter((date): date is string => !!date)
      .map((date) => new Date(date))
      .sort((a, b) => a.getTime() - b.getTime());

    return dates.length > 0 ? dates[0].toISOString() : null;
  }, [productsArray]);

  const [mounted] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });

  useEffect(() => {
    const updateTime = () => {
      if (!earliestEndDate) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          expired: true,
        });
        return;
      }

      const now = new Date().getTime();
      const end = new Date(earliestEndDate).getTime();
      const difference = end - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          expired: true,
        });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        expired: false,
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [earliestEndDate]);

  return {
    productsArray,
    earliestEndDate,
    mounted,
    timeLeft,
  };
}
