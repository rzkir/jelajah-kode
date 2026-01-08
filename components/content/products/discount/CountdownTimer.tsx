export function CountdownTimer({ mounted, timeLeft }: { mounted: boolean; timeLeft: { days: number; hours: number; minutes: number; seconds: number; expired: boolean } }) {

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
