import { Link } from 'react-router-dom';
import Spider from '../components/Spider';

export default function NotFoundPage() {
    return (
        <div className="not-found-page" style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            background: '#fff',
            color: 'var(--dark)',
            padding: '2rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Interactive Spider Background */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 10,
                opacity: 1,
                pointerEvents: 'none'
            }}>
                <Spider />
            </div>

            <div className="nf-target" style={{ position: 'relative', zIndex: 1 }}>
            <h1 style={{
                fontSize: 'clamp(5rem, 15vw, 10rem)',
                fontWeight: '900',
                lineHeight: '1',
                marginBottom: '1rem',
                letterSpacing: '-0.05em'
            }}>404</h1>
            
            <div style={{
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                fontSize: '1rem',
                marginBottom: '3rem',
                opacity: 0.6
            }}>
                Project Under Development
            </div>

            <p style={{
                maxWidth: '450px',
                fontSize: '1.2rem',
                lineHeight: '1.6',
                marginBottom: '3rem',
                color: '#666'
            }}>
                This project page is currently being polished to meet our high standards. Check back soon for the full case study.
            </p>

            <Link to="/" className="btn btn-solid" style={{
                padding: '1.2rem 2.5rem',
                fontSize: '0.9rem'
            }}>
                Return to Home →
            </Link>
            </div>
        </div>
    );
}
