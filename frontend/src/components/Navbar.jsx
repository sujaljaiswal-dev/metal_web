import { Link, useEffect, useState } from 'react';

const navItems = [
    { href: '#services', label: 'Services' },
    { href: '#work', label: 'Work' },
    { href: '#agency', label: 'Agency' },
    { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: '-40% 0px -55% 0px' }
        );

        document.querySelectorAll('section[id]').forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const handleAnchorClick = (e) => {
        const href = e.currentTarget.getAttribute('href');
        if (!href.startsWith('#')) return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (!target) return;

        const navHeight = document.getElementById('navbar')?.offsetHeight || 0;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
        setOpen(false);
    };

    return (
        <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
            <div className="nav-inner">
                <a href="#hero" className="logo-wrap" aria-label="Metal Web home" onClick={handleAnchorClick}>
                    <div className="logo-icon">
                        <div className="li-bar">
                            <span className="dot red"></span>
                            <span className="dot yellow"></span>
                            <span className="dot green"></span>
                        </div>
                        <div className="li-body">MW</div>
                    </div>
                    <span className="logo-text">METAL_WEB</span>
                </a>

                <div className="nav-links">
                    {navItems.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className={`nav-link ${activeSection === item.href.slice(1) ? 'active' : ''}`}
                            onClick={handleAnchorClick}
                        >
                            {item.label}
                        </a>
                    ))}
                </div>

                <a href="#contact" className="btn btn-solid nav-cta" onClick={handleAnchorClick}>
                    Start a project
                </a>

                <button
                    type="button"
                    className={`hamburger ${open ? 'open' : ''}`}
                    id="hamburger"
                    aria-label="Menu"
                    aria-expanded={open}
                    aria-controls="mobileMenu"
                    onClick={() => setOpen((value) => !value)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>

            <div className={`mobile-menu ${open ? 'open' : ''}`} id="mobileMenu">
                {navItems.map((item) => (
                    <a
                        key={item.href}
                        href={item.href}
                        className="mob-link"
                        onClick={handleAnchorClick}
                    >
                        {item.label}
                    </a>
                ))}
                <a href="#contact" className="mob-link mob-cta" onClick={handleAnchorClick}>
                    Start a project →
                </a>
            </div>
        </nav>
    );
}
