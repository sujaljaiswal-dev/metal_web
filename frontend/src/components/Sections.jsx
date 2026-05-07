import React, { Fragment, useRef, useState } from 'react';
import Reveal from './Reveal';
import SectionHeader from './SectionHeader';
// import Spider from './Spider'; // Temporarily disabled
import { heroStats, processSteps, services, testimonialStats, tickerItems, work } from '../data/siteData';
import useCountUp from '../hooks/useCountUp';
import { useRowFlipIn } from '../hooks/useRowFlipIn';
import useTickerSpeed from '../hooks/useTickerSpeed';
import useWorkSlide from '../hooks/useWorkSlide';

export function HeroSection({ tag, title, accent, primaryLabel, secondaryLabel, primaryHref = '#contact', secondaryHref = '#work' }) {
    const stat1Ref = useCountUp(10, '+', 0, 1800);
    const stat2Ref = useCountUp(4.7, '★', 1, 1800);

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
        <section id="hero" className="hero-grid" style={{ position: 'relative' }}>
            {/* <Spider /> */}
            <div className="hero-main">
                <Reveal delay={0.1}><p className="hero-tag">{tag}</p></Reveal>
                <Reveal delay={0.2}>
                    <h1 className="hero-h parallax-strong">
                        {title}
                        {accent ? <em>{accent}</em> : null}
                    </h1>
                </Reveal>
                <Reveal delay={0.3} className="hero-btns">
                    <a href={secondaryHref} className="btn btn-solid" onClick={handleAnchorClick}>
                        {primaryLabel}
                    </a>
                    <a href={primaryHref} className="btn btn-outline" onClick={handleAnchorClick}>
                        {secondaryLabel}
                    </a>
                </Reveal>
            </div>

            {heroStats.map((stat, index) => (
                <Reveal key={stat.label} className={`stat-cell ${stat.className || ''}`.trim()} delay={0.15 + index * 0.1}>
                    <span className="stat-n" ref={index === 0 ? stat1Ref : index === 1 ? stat2Ref : null}>{stat.value}</span>
                    <span className="stat-l">{stat.label}</span>
                </Reveal>
            ))}
        </section>
    );
}

export function TickerSection() {
    const repeatedItems = [...tickerItems, ...tickerItems];
    const tickerRef = useTickerSpeed();

    return (
        <div className="ticker-wrap">
            <div className="ticker" ref={tickerRef}>
                {repeatedItems.map((item, index) => (
                    <Fragment key={`${item}-${index}`}>
                        <span className="star">★</span>
                        <span>{item}</span>
                    </Fragment>
                ))}
            </div>
        </div>
    );
}

export function ServicesSection({ showHeader = true }) {
    const gridRef = useRef(null);
    useRowFlipIn(gridRef);

    return (
        <section id="services" className="services-section">
            {showHeader ? (
                <SectionHeader title="What We Do" subtitle="Services" />
            ) : null}
            <div className="services-grid" ref={gridRef}>
                {services.map((service) => (
                    <div key={service.title} className="svc">
                        <div className="svc-n parallax-soft">{service.number}</div>
                        <h3 className="svc-title">{service.title}</h3>
                        <p className="svc-desc">{service.description}</p>
                        <span className="svc-arrow">→</span>
                    </div>
                ))}
            </div>
        </section>
    );
}

export function WorkSection({ showHeader = true }) {
    const gridRef = useWorkSlide(80, 600);

    // Cycle through slide directions: left, up, right for 3-column grid
    const slideDirections = ['left', 'up', 'right'];
    const getSlideDirection = (index) => slideDirections[index % 3];

    return (
        <section id="work" className="work-section">
            {showHeader ? <SectionHeader title="Selected Work" linkText="View all projects →" /> : null}
            <div className="work-grid" ref={gridRef}>
                {work.map((project, index) => (
                    <Reveal
                        key={project.title}
                        className="work-card"
                        data-slide-direction={getSlideDirection(index)}
                        delay={index * 0.1}
                    >
                        <div className={`work-img ${project.imageClass} parallax-soft`}>
                            <span className={`wi-label ${project.labelClass}`.trim()}>{project.label}</span>
                        </div>
                        <div className="work-info">
                            <h3 className="work-title">{project.title}</h3>
                            <p className="work-sub">{project.subtitle}</p>
                        </div>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}

export function ProcessSection({ showHeader = true, includeTestimonial = true }) {
    return (
        <section id="agency" className="process-section">
            {showHeader ? <SectionHeader title="How We Work" subtitle="Our process" /> : null}
            <div className="process-grid">
                {processSteps.map((step, index) => (
                    <Reveal key={step.title} className="process-step" delay={index * 0.1}>
                        <div className="ps-n">{step.number}</div>
                        <h3 className="ps-title">{step.title}</h3>
                        <p className="ps-desc">{step.description}</p>
                    </Reveal>
                ))}
            </div>

            {includeTestimonial ? (
                <div className="testimonial">
                    <Reveal className="t-left">
                        <p className="t-quote">
                            "Metal Web turned our rough idea into a product that actually converts. Best web investment we've made."
                        </p>
                        <span className="t-author">— Priya Mehta, Founder · Launchpad</span>
                    </Reveal>
                    <Reveal className="t-right" delay={0.15}>
                        {testimonialStats.map((stat) => (
                            <div key={stat.label} className="ts-item">
                                <div className="ts-n">{stat.value}</div>
                                <div className="ts-l">{stat.label}</div>
                            </div>
                        ))}
                    </Reveal>
                </div>
            ) : null}
        </section>
    );
}

export function ContactSection() {
    const formRef = useRef(null);
    const [submitted, setSubmitted] = useState(false);
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formRef.current) return;

        // Run native form validation first (this allows required, email, minlength etc.)
        if (formRef.current && !formRef.current.checkValidity()) {
            formRef.current.reportValidity();
            return;
        }

        setSending(true);
        try {
            const fd = new FormData(formRef.current);
            const payload = {
                name: (fd.get('name') || '').toString().trim(),
                email: (fd.get('email') || '').toString().trim(),
                serviceType: (fd.get('service') || '').toString().trim(),
                budget: (fd.get('budget') || '').toString().trim(),
                description: (fd.get('message') || '').toString().trim(),
            };

            const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

            const res = await fetch(`${API_BASE}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json().catch(() => ({}));

            if (res.ok && data.success) {
                setSubmitted(true);
                if (formRef.current) formRef.current.reset();
                setTimeout(() => {
                    setSubmitted(false);
                }, 3500);
            } else {
                // Show validation error details if available
                console.error('Contact submission failed:', data);
                const serverMessage = data?.message || 'Failed to send message.';
                const details = Array.isArray(data?.errors)
                    ? data.errors.map((err) => `${err.param}: ${err.msg}`).join('\n')
                    : '';

                alert(details ? `${serverMessage}\n\n${details}` : serverMessage);
            }
        } catch (err) {
            console.error('Network error submitting contact form:', err);
            alert('Something went wrong. Please try again later.');
        } finally {
            setSending(false);
        }
    };

    return (
        <section id="contact" className="cta-section">
            <div className="cta-inner contact-grid">
                <Reveal className="contact-left">
                    <p className="contact-tag">Get in touch</p>
                    <h2 className="cta-text">
                        Ready to build<br />
                        something <em>great?</em>
                    </h2>
                    <p className="contact-desc">
                        Tell us about your project and we'll get back to you within 24 hours with a free consultation.
                    </p>
                    <div className="contact-info">
                        <a href="mailto:hello@metalweb.agency" className="contact-link">
                            <span className="contact-link-icon">✉</span>
                            hello@metalweb.agency
                        </a>
                        <a href="tel:+919876543210" className="contact-link">
                            <span className="contact-link-icon">☎</span>
                            +91 98765 43210
                        </a>
                    </div>
                </Reveal>

                <Reveal className="contact-right" delay={0.15}>
                    <div className="contact-form-wrap">
                        <form ref={formRef} className={`contact-form ${submitted ? 'form-hidden' : ''}`} onSubmit={handleSubmit} autoComplete="off">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="contact-name" className="form-label">Name</label>
                                    <input id="contact-name" name="name" type="text" className="form-input" placeholder="John Doe" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="contact-email" className="form-label">Email</label>
                                    <input id="contact-email" name="email" type="email" className="form-input" placeholder="john@company.com" required />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="contact-service" className="form-label">Service</label>
                                    <select id="contact-service" name="service" className="form-input form-select" required defaultValue="">
                                        <option value="" disabled>Select a service</option>
                                        <option value="web-design">Web Design</option>
                                        <option value="web-dev">Web Development</option>
                                        <option value="branding">Branding &amp; Identity</option>
                                        <option value="seo">SEO &amp; Marketing</option>
                                        <option value="ecommerce">E-Commerce</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="contact-budget" className="form-label">Budget</label>
                                    <select id="contact-budget" name="budget" className="form-input form-select" defaultValue="">
                                        <option value="" disabled>Select range</option>
                                        <option value="5k-10k">₹5K – ₹10K</option>
                                        <option value="10k-25k">₹10K – ₹25K</option>
                                        <option value="25k-50k">₹25K – ₹50K</option>
                                        <option value="50k+">₹50K+</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="contact-message" className="form-label">Project Details</label>
                                <textarea id="contact-message" name="message" className="form-input form-textarea" placeholder="Tell us about your project, goals, and timeline..." rows="5" required></textarea>
                            </div>

                            <button type="submit" className="btn btn-yellow contact-submit" disabled={sending}>
                                {sending ? 'Sending…' : 'Send Message →'}
                            </button>
                        </form>

                        {/* Success overlay */}
                        <div className={`form-success ${submitted ? 'show' : ''}`}>
                            <svg className="checkmark" viewBox="0 0 52 52" fill="none">
                                <circle className="checkmark-circle" cx="26" cy="26" r="24" stroke="var(--y)" strokeWidth="2.5" fill="none" />
                                <path className="checkmark-check" d="M15 27l7 7 15-16" stroke="var(--y)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            </svg>
                            <p className="success-title">Message Sent!</p>
                            <p className="success-desc">We'll get back to you within 24 hours.</p>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
