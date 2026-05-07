import { useEffect, useRef } from 'react';

/**
 * useStaggerReveal — Reveals grid items one by one when container enters viewport
 * @param {number} staggerDelay - Delay between each item in milliseconds (default 80)
 * @param {number} duration - Animation duration per item in milliseconds (default 500)
 */
export default function useStaggerReveal(staggerDelay = 80, duration = 500) {
    const containerRef = useRef(null);
    const observerRef = useRef(null);
    const timeoutsRef = useRef([]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const animationDuration = prefersReducedMotion ? 0 : duration;

        const revealCards = () => {
            const cards = container.querySelectorAll('[data-stagger-item]');

            cards.forEach((card, index) => {
                const timeoutId = setTimeout(() => {
                    card.classList.add('stagger-visible');
                    if (animationDuration > 0) {
                        card.style.setProperty('--stagger-duration', `${animationDuration}ms`);
                    }
                }, index * staggerDelay);

                timeoutsRef.current.push(timeoutId);
            });

            observerRef.current?.unobserve(container);
        };

        observerRef.current = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    revealCards();
                }
            },
            { threshold: 0.1 }
        );

        observerRef.current.observe(container);

        return () => {
            timeoutsRef.current.forEach(id => clearTimeout(id));
            observerRef.current?.disconnect();
        };
    }, [staggerDelay, duration]);

    return containerRef;
}
