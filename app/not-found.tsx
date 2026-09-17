import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { navLinks, phone, phoneHref } from "@/content/site";

/**
 * Next's built-in 404 renders unstyled and, more importantly, carries no
 * robots directive. A missing page that returns a crawlable, indexable body is
 * how soft-404s end up in the index.
 */
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="section-pad">
      <div className="shell">
        <p className="eyebrow dark">Error 404</p>
        <h1>This page has moved or never existed.</h1>
        <p className="mt-5 max-w-[60ch] text-[17px] leading-relaxed">
          Nothing is here at that address. The pages below cover the studio, the
          Buckhead showroom and how a project runs — or call us and we will
          point you at the right one.
        </p>

        <nav className="mt-9 flex flex-wrap gap-3" aria-label="Site sections">
          {navLinks.map((link) => (
            <Button asChild key={link.href} variant="outline" size="wide">
              <Link href={link.href} scroll={false}>
                {link.label}
              </Link>
            </Button>
          ))}
          <Button asChild variant="default" size="wide">
            <a href={phoneHref}>Call {phone}</a>
          </Button>
        </nav>
      </div>
    </section>
  );
}
