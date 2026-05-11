import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ScrollEffects from './components/ScrollEffects';
import Loader from './components/Loader';
import SEO from './components/SEO';

export default function App() {
    const [loaderFinished, setLoaderFinished] = useState(false);

    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        window.scrollTo({ top: 0, behavior: 'auto' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, []);

    useEffect(() => {
        if (!loaderFinished) return;

        const scrollToTop = () => {
            window.scrollTo({ top: 0, behavior: 'auto' });
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        };

        const rafId = window.requestAnimationFrame(scrollToTop);

        return () => window.cancelAnimationFrame(rafId);
    }, [loaderFinished]);

    return (
        <>
            <SEO />
            <Loader
                onFinished={() => {
                    setLoaderFinished(true);
                    setTimeout(() => {
                        document.body.classList.add('loader-animation-done');
                        window.dispatchEvent(new Event('loaderFinished'));
                    }, 1000);
                }}
            />
            <Navbar />
            <div className={`app-wrapper ${loaderFinished ? 'loader-exit' : ''}`}>
                <div className="scroll-progress" aria-hidden="true"></div>
                <ScrollEffects />
                <main>
                    <HomePage />
                </main>
                <Footer />
            </div>
        </>
    );
}
