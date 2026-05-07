import { useEffect } from 'react';

export default function ScrollEffects() {
    useEffect(() => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const root = document.documentElement;
        const progressBar = document.querySelector('.scroll-progress');
        const softEls = Array.from(document.querySelectorAll('.parallax-soft'));
        const strongEls = Array.from(document.querySelectorAll('.parallax-strong'));

        if (reduceMotion) {
            if (progressBar) {
                progressBar.style.transform = 'scaleX(1)';
            }
            return undefined;
        }

        let rafId = null;

        const render = () => {
            const doc = document.documentElement;
            const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
            const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));

            root.style.setProperty('--scroll-progress', progress.toFixed(4));
            if (progressBar) {
                progressBar.style.transform = `scaleX(${progress})`;
            }

            const viewportMid = window.innerHeight / 2;

            softEls.forEach((el) => {
                const rect = el.getBoundingClientRect();
                const elMid = rect.top + rect.height / 2;
                const delta = (viewportMid - elMid) * 0.045;
                el.style.setProperty('--parallax-y', `${Math.max(-18, Math.min(18, delta)).toFixed(2)}px`);
            });

            strongEls.forEach((el) => {
                const rect = el.getBoundingClientRect();
                const elMid = rect.top + rect.height / 2;
                const delta = (viewportMid - elMid) * 0.08;
                el.style.setProperty('--parallax-y', `${Math.max(-28, Math.min(28, delta)).toFixed(2)}px`);
            });

            rafId = null;
        };

        const onScrollOrResize = () => {
            if (rafId != null) {
                return;
            }
            rafId = window.requestAnimationFrame(render);
        };

        render();
        window.addEventListener('scroll', onScrollOrResize, { passive: true });
        window.addEventListener('resize', onScrollOrResize);

        return () => {
            if (rafId != null) {
                window.cancelAnimationFrame(rafId);
            }
            window.removeEventListener('scroll', onScrollOrResize);
            window.removeEventListener('resize', onScrollOrResize);
        };
    }, []);

    return null;
}
