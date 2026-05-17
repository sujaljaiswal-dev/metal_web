import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './styles/index.css';

if (typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    const fallbackRoute = url.searchParams.get('__mw_route');
    if (fallbackRoute) {
        window.history.replaceState({}, '', fallbackRoute);
    }
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <HelmetProvider>
            <App />
        </HelmetProvider>
    </React.StrictMode>,
);
