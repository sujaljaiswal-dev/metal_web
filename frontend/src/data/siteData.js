export const tickerItems = [
    'Web Design',
    'Development',
    'Motion Design',
    'E-Commerce',
    'Next.js',
    'Webflow',
];

export const services = [
    {
        number: '01 /',
        title: 'Web Design',
        description: 'Pixel-perfect sites that perform on every device. Figma to browser without compromise.',
        icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line><line x1="10" y1="21" x2="14" y2="21"></line></svg>`
    },
    {
        number: '02 /',
        title: 'Development',
        description: 'Clean code. Fast load. Zero compromise. React, Next.js, Webflow — we pick the right tool.',
        icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`
    },
    {
        number: '03 /',
        title: 'E-Commerce',
        description: 'WooCommerce stores engineered to convert. Built around your revenue goals.',
        icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`
    },
    {
        number: '04 /',
        title: 'Motion Design',
        description: 'Animations and interactions that bring your brand to life without slowing things down.',
        icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`
    },
    {
        number: '05 /',
        title: 'Optimization',
        description: 'CRO, SEO, performance audits. We turn traffic into paying customers, consistently.',
        icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>`
    },
    {
        number: '06 /',
        title: 'Product Engineering',
        description: 'Scaling digital products with robust architecture and high-performance code. From MVP to enterprise.',
        icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`
    },
];

export const work = [
    {
        label: 'Design + Dev',
        labelClass: '',
        title: 'EarthPlate',
        subtitle: 'Culinary Sanctuary · 2025',
        imageClass: 'wimg-a',
        url: '/project/earthplate',
        slug: 'earthplate',
        liveLink: 'https://earthplate-v1.onrender.com/',
        details: {
            description: 'An exclusive fine-dining takeaway experience that brings the essence of the Earth to your sanctuary. EarthPlate is a high-performance web experience designed to feel as organic as the food it serves.',
            techStack: ['React 18', 'Vite', 'Three.js', 'React Three Fiber', 'Framer Motion', 'Tailwind CSS', 'Lucide React'],
            features: [
                { title: 'Global Flavor Explorer', desc: 'Interactive 3D globe to discover the origin of ingredients.' },
                { title: 'Manifest Search', desc: 'Real-time refined search for the seasonal menu.' },
                { title: 'Location Guard', desc: 'Geolocation-based availability verification.' },
                { title: 'Exclusive UX', desc: 'Custom cursor, magnetic interactions, and cinematic transitions.' }
            ],
            process: [
                { step: '01', title: 'Concept', desc: 'Mapping the digital journey to match the physical sanctuary experience.' },
                { step: '02', title: '3D Mapping', desc: 'Developing the WebGL globe to showcase global ingredient sourcing.' },
                { step: '03', title: 'UI/UX', desc: 'Implementing cinematic transitions and magnetic interactions.' },
                { step: '04', title: 'Launch', desc: 'Performance optimization for global accessibility.' }
            ],
            testimonial: {
                quote: "The culinary world has never looked this good online. Metal_Web delivered a sanctuary for our brand that truly resonates with our audience.",
                clientName: "Elena Rossi",
                clientRole: "Founder, EarthPlate"
            }
        }
    },
    {
        label: 'Design + Dev',
        labelClass: '',
        title: 'Buildstack SaaS',
        subtitle: 'Landing page · 2024',
        imageClass: 'wimg-b',
        url: '/project/buildstack',
        slug: 'buildstack',
        details: {
            description: 'Buildstack is a SaaS platform for developers to launch and scale products faster. The goal was to design a clean, conversion-focused landing page that builds trust and clearly communicates value.',
            techStack: ['Webflow', 'HTML5', 'CSS3', 'JavaScript', 'GSAP', 'Figma'],
            features: [
                { title: '40% increase in sign-ups', desc: 'Optimized conversion funnel.' },
                { title: '2.5s average load time', desc: 'High performance assets.' },
                { title: 'Fully responsive design', desc: 'Seamless across all devices.' },
                { title: 'SEO optimized', desc: 'Search engine ready.' }
            ],
            process: [
                { step: '01', title: 'Discovery', desc: 'Understood the product, audience, and competitors. Mapped key user journeys.' },
                { step: '02', title: 'Strategy', desc: 'Planned the information architecture and conversion paths.' },
                { step: '03', title: 'Design', desc: 'Created wireframes and high-fidelity UI in Figma with a focus on visual hierarchy.' },
                { step: '04', title: 'Development', desc: 'Built the site with clean, scalable code and smooth interactions.' }
            ],
            testimonial: {
                quote: "Metal_Web truly gets what modern SaaS needs. The new landing page not only looks amazing but also converts way better than our previous one. Highly recommended!",
                clientName: "Arjun Mehta",
                clientRole: "Founder, Buildstack"
            }
        }
    },
    {
        label: 'E-commerce',
        labelClass: 'dark',
        title: 'The Metal Shop',
        subtitle: 'Custom Furniture · 2024',
        imageClass: 'wimg-c',
        url: '/project/metal-shop',
        slug: 'metal-shop',
        details: {
            description: 'The Metal Shop is a custom furniture studio. We built an immersive e-commerce experience that showcases the craftsmanship and materials of their unique pieces.',
            techStack: ['Shopify', 'React', 'Three.js', 'Framer Motion', 'Stripe'],
            features: [
                { title: '3D Product Viewer', desc: 'Interactive view of custom metal work.' },
                { title: 'Custom Configurator', desc: 'Real-time material selection.' },
                { title: 'Secure Checkout', desc: 'Seamless Stripe integration.' },
                { title: 'Inventory Sync', desc: 'Automated stock management.' }
            ],
            process: [
                { step: '01', title: 'Auditing', desc: 'Reviewing current sales data and pain points.' },
                { step: '02', title: 'UX Strategy', desc: 'Designing the custom configurator flow.' },
                { step: '03', title: '3D Modeling', desc: 'Creating high-fidelity metal shaders.' },
                { step: '04', title: 'Deployment', desc: 'Launching the unified e-commerce experience.' }
            ],
            testimonial: {
                quote: "Our online sales doubled within the first month. The 3D showcase of our furniture is a game-changer and has significantly reduced inquiries about materials.",
                clientName: "Mark Harrison",
                clientRole: "Director, The Metal Shop"
            }
        }
    },
];

export const processSteps = [
    {
        number: '01',
        title: 'Discovery',
        description: 'We dive deep into your goals, audience, and competitive landscape before touching a pixel.',
        icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`
    },
    {
        number: '02',
        title: 'Strategy',
        description: 'We map the right structure, tech stack, and design direction aligned with your business.',
        icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`
    },
    {
        number: '03',
        title: 'Design',
        description: 'Pixel-perfect Figma prototypes reviewed with you. Every detail is intentional.',
        icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>`
    },
    {
        number: '04',
        title: 'Launch',
        description: 'Shipped on time. Tested across all devices, browsers, and screen sizes.',
        icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-5c1.62-2.2 5-3 5-3"></path><path d="M12 15v5s3.03-.55 5-2c2.2-1.62 3-5 3-5"></path></svg>`
    },
];

export const heroStats = [
    {
        value: '35+',
        label: 'Projects shipped',
        className: '',
        countTarget: 35,
        countSuffix: '+',
        countDecimals: 0,
    },
    {
        value: '4.7★',
        label: 'Average client rating',
        className: 'yellow',
        countTarget: 4.7,
        countSuffix: '★',
        countDecimals: 1,
    },
];

export const testimonialStats = [
    { value: '3 weeks', label: 'Average delivery time' },
    { value: '98%', label: 'Client retention rate' },
    { value: 'Mumbai', label: 'Based in India · Remote globally' },
];
