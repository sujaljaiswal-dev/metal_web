import { ContactSection, HeroSection, ServicesSection, TickerSection } from '../components/Sections';

export default function ServicesPage() {
    return (
        <>
            <HeroSection
                tag="Capabilities — Strategy, design, development"
                title={<>Services<br /><em>Built</em><br />For Scale.</>}
                primaryLabel="See work →"
                secondaryLabel="Start a project"
                primaryHref="/contact"
                secondaryHref="/work"
            />
            <TickerSection />
            <ServicesSection />
            <ContactSection />
        </>
    );
}
