import { useEffect, useRef } from 'react';

/**
 * useCountUp — Animates a number from 0 to target when element enters viewport
 * @param {number} target - Final count value
 * @param {string} suffix - Text to append after number (e.g., '+', '★')
 * @param {number} decimals - Number of decimal places to show (0 for integers)
 * @param {number} duration - Animation duration in milliseconds (default 1800)
 */
export default function useCountUp(target, suffix = '', decimals = 0, duration = 1800) {
    const elementRef = useRef(null);
    const observerRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const animationDuration = prefersReducedMotion ? 0 : duration;

        const formatNumber = (num) => {
            return num.toFixed(decimals).replace(/\.0+$/, '');
        };

        if (animationDuration > 0) {
            element.textContent = formatNumber(0) + suffix;
        }

        const animate = () => {
            const startTime = performance.now();

            const frame = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / animationDuration, 1);

                // Ease-out cubic
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                const currentValue = target * easeProgress;

                element.textContent = formatNumber(currentValue) + suffix;

                if (progress < 1) {
                    animationRef.current = requestAnimationFrame(frame);
                }
            };

            if (animationDuration === 0) {
                element.textContent = formatNumber(target) + suffix;
            } else {
                animationRef.current = requestAnimationFrame(frame);
            }
        };

        observerRef.current = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    const isLoaderDone = document.body.classList.contains('loader-animation-done');
                    if (isLoaderDone) {
                        animate();
                    } else {
                        window.addEventListener('loaderFinished', animate, { once: true });
                    }
                    observerRef.current?.unobserve(element);
                }
            },
            { threshold: 0.1 }
        );

        observerRef.current.observe(element);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            observerRef.current?.disconnect();
        };
    }, [target, suffix, decimals, duration]);

    return elementRef;
}
