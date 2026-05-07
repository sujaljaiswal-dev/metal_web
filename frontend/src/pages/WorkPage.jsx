import { ContactSection, HeroSection, TickerSection, WorkSection } from '../components/Sections';

export default function WorkPage() {
    return (
        <>
            <HeroSection
                tag="Selected projects — Product, e-commerce, branding"
                title={<>Our<br /><em>Selected</em><br />Work.</>}
                primaryLabel="Start a project →"
                secondaryLabel="View services"
                primaryHref="/contact"
                secondaryHref="/services"
            />
            <TickerSection />
            <WorkSection />
            <ContactSection />
        </>
    );
}
