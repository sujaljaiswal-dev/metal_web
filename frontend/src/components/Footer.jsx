export default function Footer() {
    return (
        <footer className="footer">
            <div className="foot-grid">
                <div className="fc">
                    <div className="fc-label">Agency</div>
                    <div className="fc-val">METAL_WEB</div>
                </div>
                <div className="fc">
                    <div className="fc-label">Location</div>
                    <div className="fc-val">Mumbai, India</div>
                </div>
                <div className="fc">
                    <div className="fc-label">Contact</div>
                    <div className="fc-val">
                        <a href="mailto:hello@metalweb.agency">hello@metalweb.agency</a>
                    </div>
                </div>
                <div className="fc">
                    <div className="fc-label">Socials</div>
                    <div className="fc-val socials">
                        <a href="#">Instagram</a>
                        <a href="#">LinkedIn</a>
                        <a href="#">Twitter</a>
                    </div>
                </div>
            </div>
            <div className="copyright">
                <span>© 2025 Metal Web. All rights reserved.</span>
                <span>
                    Built by <a href="#hero">Metal Web</a> ★
                </span>
            </div>
        </footer>
    );
}
