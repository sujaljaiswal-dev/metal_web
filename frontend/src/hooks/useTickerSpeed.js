import { useEffect, useRef } from 'react';

/**
 * useTickerSpeed — Returns ref for ticker element
 * Ticker animates at a constant speed regardless of scroll
 */
export default function useTickerSpeed() {
    const tickerRef = useRef(null);

    useEffect(() => {
        const ticker = tickerRef.current;
        if (!ticker) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!prefersReducedMotion) {
            ticker.style.animationDuration = '26s';
        }

        return () => {
            // Cleanup if needed
        };
    }, []);

    return tickerRef;
}
