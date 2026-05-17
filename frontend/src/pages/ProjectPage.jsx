import { useParams, Link } from 'react-router-dom';
import { work } from '../data/siteData';
import '../styles/project-detail.css';
import SEO from '../components/SEO';
import NotFoundPage from './NotFoundPage';

// Project Mockups
import earthDesktop from '../assets/projectPic/EarthPLate_desktop.png';
import earthMobile from '../assets/projectPic/EarthPlate_mobile.png';

export default function ProjectDetail() {
    const { slug } = useParams();
    const projects = work;
    const project = projects.find((p) => p.slug === slug);

    if (!project) {
        return <NotFoundPage />;
    }

    const { details } = project;

    return (
        <>
            <SEO
                title={`${project.title} — Metal Web Case Study`}
                description={project.details?.description || project.subtitle}
                url={`https://www.metalweb.site/project/${project.slug}`}
            />
            <div className="project-detail-page">
                <div className="split-layout">
                    {/* ── LEFT PANE ── */}
                    <div className="left-pane">
                        <div className="lp-text-content">
                            <span className="breadcrumb">WORK / {project.title.toUpperCase()}</span>
                            <h1 className="lp-title">{project.title}</h1>
                            <p className="lp-subtitle">{details?.description || project.subtitle}</p>

                            <div className="lp-tags">
                                <span className="tag-solid">{project.label}</span>
                                {project.liveLink ? (
                                    <a
                                        href={project.liveLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="tag-outline"
                                        style={{ textDecoration: 'none', cursor: 'pointer', transition: 'all 0.3s ease' }}
                                    >
                                        {project.title.includes('SaaS') ? 'SaaS' : 'Web Experience'} ↗
                                    </a>
                                ) : (
                                    <span className="tag-outline">{project.title.includes('SaaS') ? 'SaaS' : 'Web Experience'}</span>
                                )}
                            </div>
                        </div>

                        <div className="lp-visual">
                            <div className="mockup-wrapper">
                                <div className="mockup-header">
                                    <div className="mockup-dot"></div>
                                    <div className="mockup-dot"></div>
                                    <div className="mockup-dot"></div>
                                </div>
                                <div className="mockup-body">
                                    {project.slug === 'earthplate' ? (
                                        <>
                                            <img src={earthDesktop} alt="Desktop View" className="mockup-img d-only" />
                                            <img src={earthMobile} alt="Mobile View" className="mockup-img m-only" />
                                        </>
                                    ) : (
                                        project.title
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="meta-bar">
                            <div className="meta-col">
                                <span className="mc-label"><span role="img" aria-label="calendar">📅</span> Year</span>
                                <span className="mc-value">{project.subtitle.split('·')[1]?.trim() || '2024'}</span>
                            </div>
                            <div className="meta-col">
                                <span className="mc-label"><span role="img" aria-label="user">👤</span> Role</span>
                                <span className="mc-value">Design - Development</span>
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT PANE ── */}
                    <div className="right-pane">

                        {/* Row 1: Overview | Tech Stack */}
                        <div className="rp-row">
                            <div className="rp-cell">
                                <h3 className="cell-title">Overview</h3>
                                <p className="cell-text">
                                    {details?.description || 'A comprehensive digital transformation project focused on user experience and brand identity. The goal was to design a clean, conversion-focused landing page that builds trust and clearly communicates value.'}
                                </p>
                            </div>
                            <div className="rp-cell">
                                <h3 className="cell-title">Tech Stack</h3>
                                <div className="tech-list">
                                    {(details?.techStack || ['Webflow', 'HTML5', 'CSS3', 'JavaScript', 'GSAP', 'Figma']).slice(0, 6).map((tech, idx) => (
                                        <div key={idx} className="tech-item">
                                            <div className="tech-icon">{tech.charAt(0)}</div>
                                            <span>{tech}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Row 2: My Approach | Project Highlights */}
                        <div className="rp-row">
                            <div className="rp-cell">
                                <h3 className="cell-title">Our Approach</h3>
                                <div className="approach-list">
                                    {(details?.process || [
                                        { step: '01', title: 'Discovery', desc: 'Understood the product, audience, and competitors. Mapped key user journeys.' },
                                        { step: '02', title: 'Strategy', desc: 'Planned the information architecture and conversion paths.' },
                                        { step: '03', title: 'Design', desc: 'Created wireframes and high-fidelity UI in Figma with a focus on visual hierarchy.' },
                                        { step: '04', title: 'Development', desc: 'Built the site with clean, scalable code and smooth interactions.' }
                                    ]).slice(0, 4).map((step) => (
                                        <div key={step.step} className="approach-item">
                                            <div className="ai-num">{step.step}</div>
                                            <div className="ai-content">
                                                <h4>{step.title}</h4>
                                                <p>{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="rp-cell bg-yellow">
                                <h3 className="cell-title">Project Highlights</h3>
                                <div className="highlights-list">
                                    {(details?.features || [
                                        { title: '40% increase in sign-ups' },
                                        { title: '2.5s average load time' },
                                        { title: 'Fully responsive design' },
                                        { title: 'SEO optimized' }
                                    ]).slice(0, 4).map((feature, idx) => (
                                        <div key={idx} className="hl-item">
                                            {feature.title || feature.desc}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Row 3: Client Quote */}
                        <div className="rp-row-client">
                            <div className="client-quote">
                                <h3 className="cq-title">What the Client Said</h3>
                                <p className="cq-text">
                                    {details?.testimonial?.quote || "Metal_Web truly gets what modern web needs. The new experience not only looks amazing but also converts way better than our previous one. Highly recommended!"}
                                </p>
                            </div>
                            <div className="client-profile">
                                <div className="cp-avatar">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--dark)" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                </div>
                                <div className="cp-info">
                                    <h4>{details?.testimonial?.clientName || "Client Name"}</h4>
                                    <p>{details?.testimonial?.clientRole || `Founder, ${project.title}`}</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* CTA Footer Row (Spans full width) */}
                <div className="rp-row-cta">
                    <div className="cta-left">
                        <h3>Have a project in mind?</h3>
                        <p>Let's build something great together.</p>
                    </div>
                    <div className="cta-right">
                        <Link to="/" className="cta-btn">
                            Start a Project →
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
