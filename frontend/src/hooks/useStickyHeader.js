import { useEffect, useRef } from 'react';

/**
 * useStickyHeader — Makes section headers sticky with stuck-state detection
 * @param {number} navbarHeight - Height of navbar in pixels (default 64)
 */
export default function useStickyHeader(navbarHeight = 64) {
    const headerRef = useRef(null);
    const sentinelRef = useRef(null);
    const observerRef = useRef(null);

    useEffect(() => {
        const header = headerRef.current;
        const sentinel = sentinelRef.current;

        if (!header || !sentinel) return;

        // Create sentinel div above header for stuck detection
        const sentinelElement = document.createElement('div');
        sentinelElement.style.cssText = `
      position: absolute;
      top: ${navbarHeight}px;
      left: 0;
      width: 100%;
      height: 1px;
      pointer-events: none;
    `;
        header.parentElement?.insertBefore(sentinelElement, header);

        observerRef.current = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    header.classList.remove('is-stuck');
                } else {
                    header.classList.add('is-stuck');
                }
            },
            {
                rootMargin: `${navbarHeight}px 0px 0px 0px`,
                threshold: 1,
            }
        );

        observerRef.current.observe(sentinelElement);

        return () => {
            sentinelElement.remove();
            observerRef.current?.disconnect();
        };
    }, [navbarHeight]);

    return headerRef;
}
