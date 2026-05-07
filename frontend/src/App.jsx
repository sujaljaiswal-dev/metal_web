import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ScrollEffects from './components/ScrollEffects';
import Loader from './components/Loader';

export default function App() {
    const [loaderFinished, setLoaderFinished] = useState(false);

    return (
        <>
            <Loader onFinished={() => {
                setLoaderFinished(true);
                setTimeout(() => {
                    document.body.classList.add('loader-animation-done');
                    window.dispatchEvent(new Event('loaderFinished'));
                }, 1000);
            }} />
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
