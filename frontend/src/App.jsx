import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProjectDetail from './pages/ProjectPage';
import NotFoundPage from './pages/NotFoundPage';
import ScrollEffects from './components/ScrollEffects';
import Loader from './components/Loader';
import SEO from './components/SEO';

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

function ConditionalFooter() {
    const location = useLocation();
    const isValidRoute = location.pathname === '/' || location.pathname.startsWith('/project/');
    return isValidRoute ? <Footer /> : null;
}

export default function App() {
    const [loaderFinished, setLoaderFinished] = useState(false);
    const [mountLoader, setMountLoader] = useState(true);

    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);
    }, []);

    const handleLoaderFinished = () => {
        setLoaderFinished(true);
        document.body.classList.add('loader-animation-done');
        window.dispatchEvent(new Event('loaderFinished'));
        setTimeout(() => {
            setMountLoader(false);
        }, 1200); // keep loader mounted while the exit animation completes
    };

    return (
        <BrowserRouter>
            <SEO />
            <ScrollToTop />
            {mountLoader && <Loader onFinished={handleLoaderFinished} />}
            <Navbar />
            <div className={`app-wrapper ${loaderFinished ? 'loader-exit' : ''} ${mountLoader ? 'loader-present' : ''}`}>
                <div className="scroll-progress" aria-hidden="true"></div>
                <ScrollEffects />
                <main>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/project/:slug" element={<ProjectDetail />} />
                        <Route path="/404" element={<NotFoundPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </main>
                <ConditionalFooter />
            </div>
        </BrowserRouter>
    );
}

