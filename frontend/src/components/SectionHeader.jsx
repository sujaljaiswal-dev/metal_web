export default function SectionHeader({ title, subtitle, linkText, linkHref = '#contact' }) {
    const handleAnchorClick = (e) => {
        const href = e.currentTarget.getAttribute('href');
        if (!href.startsWith('#')) return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (!target) return;

        const navHeight = document.getElementById('navbar')?.offsetHeight || 0;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
    };

    return (
        <div className="section-header">
            <h2 className="section-title">{title}</h2>
            {linkText ? (
                <a href={linkHref} className="view-all" onClick={handleAnchorClick}>
                    {linkText}
                </a>
            ) : (
                <span className="section-sub">{subtitle}</span>
            )}
        </div>
    );
}
