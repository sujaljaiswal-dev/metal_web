import { HeroSection, ContactSection, TickerSection } from '../components/Sections';

export default function ContactPage() {
    return (
        <>
            <HeroSection
                tag="Contact — Let’s build something sharp"
                title={<>Start Your<br /><em>Project</em><br />Today.</>}
                primaryLabel="View work →"
                secondaryLabel="View services"
                primaryHref="/work"
                secondaryHref="/services"
            />
            <TickerSection />
            <ContactSection />
        </>
    );
}
