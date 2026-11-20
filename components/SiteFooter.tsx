import Image from "next/image";
import Link from "next/link";
import { ArrowUp, MapPin, Phone } from "lucide-react";

import {
  address,
  collectionCards,
  hours,
  navLinks,
  phone,
  phoneHref,
} from "@/content/site";

/** Awards won by Poggenpohl (see ASSETS.md). Marks are cut from the artwork so
 *  they can share one baseline; the names are real text. */
const awards = [
  { file: "german-design", label: "German Design Award", w: 245, h: 320 },
  { file: "german-brand", label: "German Brand Award", w: 260, h: 320 },
  { file: "designpreis", label: "Designpreis der BRD", w: 320, h: 306 },
  { file: "iconic", label: "Iconic Award", w: 248, h: 320 },
  { file: "interior-innovation", label: "Interior Innovation Award", w: 247, h: 320 },
  { file: "red-dot", label: "Red Dot Design Award", w: 320, h: 320 },
  { file: "if-design", label: "iF Product Design Award", w: 320, h: 320 },
  { file: "good-design", label: "Good Design Award", w: 320, h: 320 },
  { file: "superbrands", label: "Superbrands Germany", w: 320, h: 137 },
];

export default function SiteFooter() {
  return (
    <footer className="footer surface-dark footer-v2">
      <div className="shell">
        <section className="footer-awards" aria-label="Poggenpohl awards">
          <p className="footer-awards-title">Poggenpohl awards</p>
          <ul>
            {awards.map((award) => (
              <li key={award.file}>
                <span className="footer-awards-mark">
                  <Image
                    src={`/awards/${award.file}.png`}
                    alt=""
                    width={award.w}
                    height={award.h}
                    unoptimized
                  />
                </span>
                <span className="footer-awards-name">{award.label}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="footer-v2-grid">
          <div className="footer-v2-brand">
            <div className="footer-v2-lockup">
              <Image
                src="/brand/atelier-logo-on-dark.png"
                alt="Atelier Living Group"
                width={1600}
                height={595}
              />
              <span>Spaces That Inspire</span>
            </div>
            <a className="footer-v2-call footer-v2-call-sm" href={phoneHref}>
              <Phone aria-hidden="true" />
              {phone}
            </a>
            <div className="footer-v2-dealer">
              <Image
                className="brand-logo on-dark"
                src="/brand/poggenpohl-logo-black.svg"
                alt="Poggenpohl"
                width={75}
                height={48}
                unoptimized
              />
              <span>
                Exclusive Poggenpohl dealer
                <br />
                for Atlanta + Georgia
              </span>
            </div>
          </div>

          <nav aria-label="Footer navigation" className="footer-v2-col">
            <h3>Explore</h3>
            <ul>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} scroll={false}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Poggenpohl collections" className="footer-v2-col">
            <h3>Collections</h3>
            <ul>
              {collectionCards.map((card) => (
                <li key={card.href}>
                  <Link href={card.href} scroll={false}>
                    {card.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-v2-col footer-v2-visit">
            <h3>Visit</h3>
            <address>
              <strong>Terminus 100 Showroom</strong>
              {address.street}
              <br />
              {address.city}, {address.region} {address.postalCode}
            </address>
            <a
              className="footer-v2-directions"
              href={address.mapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              <MapPin aria-hidden="true" />
              Get directions
            </a>
            <dl>
              {hours.map((row) => (
                <div key={row.day}>
                  <dt>{row.day}</dt>
                  <dd>{row.time}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="footer-v2-bar">
          <p>
            &copy; {new Date().getFullYear()} Atelier Living Group. Exclusive
            Poggenpohl dealer for Atlanta and Georgia.
          </p>
          <span className="footer-v2-links">
            <Link href="/faq" scroll={false}>FAQ</Link>
            <Link href="/service-areas" scroll={false}>Service areas</Link>
            <Link href="/process" scroll={false}>Our process</Link>
          </span>
          <a href="#main">
            Back to top
            <ArrowUp aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
