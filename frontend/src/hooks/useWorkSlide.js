import { useEffect, useRef } from 'react';

/**
 * Effect 5: Work Grid Horizontal Slides
 * Animates work cards in sliding from different directions when grid enters viewport.
 * Each card slides from left, up, or right based on row position (3-column grid).
 * 
 * @param {number} staggerDelay - Delay between each card animation start (default: 80ms)
 * @param {number} duration - Animation duration in ms (default: 600ms)
 * @returns {React.MutableRefObject} - Ref to attach to work-grid container
 */
export default function useWorkSlide(staggerDelay = 80, duration = 600) {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const cards = Array.from(container.querySelectorAll('[data-slide-direction]'));
        if (cards.length === 0) return;

        if (prefersReduced) {
            cards.forEach((card) => card.classList.add('slide-visible'));
            return;
        }

        // Attach index to each card so we can apply a stagger on intersection
        cards.forEach((card, i) => card.setAttribute('data-ws-index', String(i)));

        const timeouts = [];

        const cardObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const card = entry.target;
                    const idx = Number(card.getAttribute('data-ws-index') || '0');

                    const id = window.setTimeout(() => {
                        card.classList.add('slide-visible');
                    }, idx * staggerDelay);

                    timeouts.push(id);
                    cardObserver.unobserve(card);
                });
            },
            {
                threshold: 0.05,
                rootMargin: '0px 0px -120px 0px'
            }
        );

        cards.forEach((card) => cardObserver.observe(card));

        return () => {
            timeouts.forEach((t) => clearTimeout(t));
            cardObserver.disconnect();
        };
    }, [staggerDelay, duration]);

    return containerRef;
}
