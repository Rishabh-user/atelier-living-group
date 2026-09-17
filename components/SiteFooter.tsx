import Link from "next/link";

import InquiryForm from "@/components/InquiryForm";
import { address, navLinks, phone, phoneHref } from "@/content/site";

export default function SiteFooter() {
  return (
    <footer className="footer surface-dark">
      <div className="shell">
        <div className="footer-grid">
          <div className="footer-brand">
            <img
              src="/alg-mark-white.png"
              alt="Atelier Living Group"
              width={260}
              height={205}
            />
            <p>Atelier Living Group</p>
            <span>Spaces That Inspire</span>
            <a className="footer-phone" href={phoneHref}>
              {phone}
            </a>
          </div>

          <InquiryForm
            variant="footer"
            className="footer-form"
            ariaLabel="Footer consultation request"
          />

          <div className="footer-contact">
            <address>
              <strong>Terminus Showroom</strong>
              {address.street}
              <br />
              {address.city}, {address.region} {address.postalCode}
            </address>
            <nav aria-label="Footer navigation" className="footer-nav">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} scroll={false}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <p className="footer-legal">
          Exclusive Poggenpohl Dealer for Atlanta and Georgia / Terminus Building
          / Luxury kitchen design-build / Fully custom German cabinetry /
          High-end appliance planning
        </p>
      </div>
    </footer>
  );
}
