"use client"

import { useEffect, useState, useCallback } from "react"

import ProductsCard from "@/components/ui/products/ProductsCard"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

function CountdownTimer({ endDate }: { endDate: string }) {
    const [mounted, setMounted] = useState(false);

    const calculateTimeLeft = useCallback(() => {
        const now = new Date().getTime();
        const end = new Date(endDate).getTime();
        const difference = end - now;

        if (difference <= 0) {
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                expired: true
            };
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000),
            expired: false
        };
    }, [endDate]);

    const [timeLeft, setTimeLeft] = useState(() => ({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        expired: false
    }));

    useEffect(() => {
        const mountTimeout = setTimeout(() => {
            setMounted(true);
        }, 0);

        const updateTime = () => {
            setTimeLeft(calculateTimeLeft());
        };

        const immediateUpdate = setTimeout(updateTime, 0);

        const interval = setInterval(updateTime, 1000);

        return () => {
            clearTimeout(mountTimeout);
            clearTimeout(immediateUpdate);
            clearInterval(interval);
        };
    }, [calculateTimeLeft]);

    if (!mounted) {
        return (
            <div className="flex items-center justify-center px-6 py-3 rounded-lg bg-red-600">
                <span className="text-white font-bold text-sm mr-3">Sale ends in:</span>
                <div className="flex items-baseline gap-1">
                    <span className="text-white font-bold text-xl">00</span>
                    <span className="text-white text-xs">d</span>
                    <span className="text-white font-bold text-xl mx-1">:</span>
                    <span className="text-white font-bold text-xl">00</span>
                    <span className="text-white text-xs">h</span>
                    <span className="text-white font-bold text-xl mx-1">:</span>
                    <span className="text-white font-bold text-xl">00</span>
                    <span className="text-white text-xs">m</span>
                    <span className="text-white font-bold text-xl mx-1">:</span>
                    <span className="text-white font-bold text-xl">00</span>
                    <span className="text-white text-xs">s</span>
                </div>
            </div>
        );
    }

    if (timeLeft.expired) {
        return (
            <div className="flex items-center justify-center px-6 py-3 rounded-lg bg-red-600">
                <span className="text-white font-bold text-sm">Sale expired</span>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center px-6 py-3 rounded-lg bg-red-600">
            <span className="text-white font-bold text-sm mr-3">Sale ends in:</span>
            <div className="flex items-baseline gap-1">
                <span className="text-white font-bold text-xl">
                    {String(timeLeft.days).padStart(2, '0')}
                </span>
                <span className="text-white text-xs">d</span>
                <span className="text-white font-bold text-xl mx-1">:</span>
                <span className="text-white font-bold text-xl">
                    {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-white text-xs">h</span>
                <span className="text-white font-bold text-xl mx-1">:</span>
                <span className="text-white font-bold text-xl">
                    {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-white text-xs">m</span>
                <span className="text-white font-bold text-xl mx-1">:</span>
                <span className="text-white font-bold text-xl">
                    {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-white text-xs">s</span>
            </div>
        </div>
    );
}

export default function ProductsDiscount({ productsDiscount }: { productsDiscount: ProductsDiscountResponse }) {
    const productsArray = Array.isArray(productsDiscount.data) ? productsDiscount.data : [];

    // Find the earliest discount end date
    const getEarliestEndDate = () => {
        const dates = productsArray
            .map(item => item.discount?.until)
            .filter((date): date is string => !!date)
            .map(date => new Date(date))
            .sort((a, b) => a.getTime() - b.getTime());

        return dates.length > 0 ? dates[0].toISOString() : null;
    };

    const earliestEndDate = getEarliestEndDate();

    return (
        <section className="py-4">
            <div className="container mx-auto px-4 space-y-6 xl:px-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    {/* Heading */}
                    <div className="flex flex-col gap-2">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Limited Time Offers</h2>
                        <p className="text-muted-foreground text-lg">Grab these deals before they expire</p>
                    </div>

                    {/* Countdowns */}
                    {earliestEndDate ? (
                        <CountdownTimer endDate={earliestEndDate} />
                    ) : (
                        <div className="flex flex-row items-center gap-3 px-4 py-2 rounded-lg bg-muted border">
                            <h3 className="text-sm font-medium text-muted-foreground">No active discounts</h3>
                        </div>
                    )}
                </div>

                {/* Products Row */}
                <ScrollArea className="w-full">
                    <div className="flex flex-row gap-6 pb-4">
                        {
                            productsArray.map((item, idx) => (
                                <div key={idx} className="shrink-0 w-96">
                                    <ProductsCard item={item} />
                                </div>
                            ))
                        }
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        </section>
    )
}