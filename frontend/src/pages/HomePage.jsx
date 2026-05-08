import { ContactSection, HeroSection, ProcessSection, ServicesSection, TickerSection, WorkSection } from '../components/Sections';

export default function HomePage() {
    return (
        <>
            <HeroSection
                tag="Est. 2025 — Web Agency · Mumbai"
                title={<>We Build<br /><em>Digital</em><br />Machines.</>}
                primaryLabel="View work →"
                secondaryLabel="Start a project"
                primaryHref="#contact"
                secondaryHref="#work"
            />
            <TickerSection />
            <ServicesSection />
            <WorkSection />
            <ProcessSection />
            <ContactSection />
        </>
    );
}
