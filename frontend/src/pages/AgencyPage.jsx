import { ContactSection, HeroSection, ProcessSection, TickerSection } from '../components/Sections';

export default function AgencyPage() {
    return (
        <>
            <HeroSection
                tag="Agency — Process, standards, delivery"
                title={<>How We<br /><em>Work</em><br />Together.</>}
                primaryLabel="Start a project →"
                secondaryLabel="View services"
                primaryHref="/contact"
                secondaryHref="/services"
            />
            <TickerSection />
            <ProcessSection />
            <ContactSection />
        </>
    );
}
