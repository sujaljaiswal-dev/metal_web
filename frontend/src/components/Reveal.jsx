import { useEffect, useRef, useState } from 'react';

export default function Reveal({ children, className = '', delay = 0, ...dataProps }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) {
            return undefined;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    const isLoaderDone = document.body.classList.contains('loader-animation-done');
                    const revealNow = () => {
                        setVisible(true);
                    };

                    if (isLoaderDone) {
                        revealNow();
                    } else {
                        window.addEventListener('loaderFinished', revealNow, { once: true });
                    }
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.12 },
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`reveal ${visible ? 'visible' : ''} ${className}`.trim()}
            style={delay ? { animationDelay: `${delay}s` } : undefined}
            {...dataProps}
        >
            {children}
        </div>
    );
}
