import { useEffect } from 'react';

export function useRowFlipIn(containerRef) {
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return undefined;

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const cards = Array.from(container.querySelectorAll('.svc'));
        if (cards.length === 0) return undefined;

        const row1 = cards.slice(0, 3);
        const row2 = cards.slice(3, 6);

        if (prefersReduced) {
            cards.forEach((c) => c.classList.add('row--visible'));
            return undefined;
        }

        let obs1 = null;
        let obs2 = null;

        const revealRow = (row) => row.forEach((c) => c.classList.add('row--visible'));

        try {
            obs1 = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            revealRow(row1);
                            obs1.disconnect();
                        }
                    });
                },
                { threshold: 0.15 },
            );

            obs2 = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setTimeout(() => revealRow(row2), 0);
                            obs2.disconnect();
                        }
                    });
                },
                { threshold: 0.15 },
            );

            if (row1[0]) obs1.observe(row1[0]);
            if (row2[0]) obs2.observe(row2[0]);
        } catch (e) {
            cards.forEach((c) => c.classList.add('row--visible'));
        }

        return () => {
            if (obs1) obs1.disconnect();
            if (obs2) obs2.disconnect();
        };
    }, [containerRef]);
}
