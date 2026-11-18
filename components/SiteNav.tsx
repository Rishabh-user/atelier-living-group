"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { navLinks, phone, phoneHref } from "@/content/site";
import { useIsomorphicLayoutEffect } from "@/lib/use-isomorphic-layout-effect";

/**
 * On the homepage the bar sits over the dark hero, where white text on a
 * transparent gradient reads well. Once the hero scrolls past - and on every
 * inner page, which has a light header - it switches to a solid light surface
 * with ink text.
 *
 * Uses a passive scroll listener. The switch point comes from the hero's
 * measured height and is recomputed on resize, so it stays correct when the
 * hero reflows. The handler is one number comparison and React bails out when
 * the value is unchanged, so it is deliberately not rAF-throttled: that would
 * make correctness depend on rAF, which browsers suspend for hidden tabs.
 *
 * The initial read runs in a layout effect so a deep link paints the correct
 * bar immediately instead of flashing the transparent hero treatment first.
 *
 * Links carry scroll={false}: the App Router's own focus-and-scroll walks the
 * new page's top-level siblings and scrollIntoView()s one of them, which on
 * /contact landed 639px down the page. StartAtTop does the reset instead.
 */
export default function SiteNav() {
  const pathname = usePathname();
  // The homepage and the product pages (/poggenpohl/[slug]) have a dark
  // full-bleed hero, marked id="top", behind the bar.
  const hasHero =
    pathname === "/" ||
    /^\/poggenpohl\/[^/]+\/?$/.test(pathname);
  const alwaysSolid = !hasHero;

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const publishNavHeight = () => {
      const h = document.querySelector(".site-nav")?.getBoundingClientRect()
        .height;
      if (h) {
        document.documentElement.style.setProperty(
          "--nav-h",
          `${Math.round(h)}px`,
        );
      }
    };

    if (alwaysSolid) {
      setScrolled(true);
      publishNavHeight();
      window.addEventListener("resize", publishNavHeight);
      return () => window.removeEventListener("resize", publishNavHeight);
    }

    const navHeight = () =>
      document.querySelector(".site-nav")?.getBoundingClientRect().height ?? 110;

    // Publish the bar's real height so CSS can offset sticky elements and
    // inner-page heroes against it. The static value in globals.css is only a
    // fallback; measuring keeps this correct when the logo is resized.
    const publishHeight = () => {
      document.documentElement.style.setProperty(
        "--nav-h",
        `${Math.round(navHeight())}px`,
      );
    };

    // Solid as soon as the page moves. Waiting for the hero to end left the
    // transparent bar floating over the hero's own text mid-scroll.
    const threshold = () => 24;

    let cutoff = threshold();

    const onScroll = () => setScrolled(window.scrollY > cutoff);
    const onResize = () => {
      publishHeight();
      cutoff = threshold();
      onScroll();
    };

    publishHeight();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [alwaysSolid, pathname]);

  // The drawer closes from the link handlers below rather than by reacting to
  // the route, which would be a cascading setState inside an effect.
  useEffect(() => {
    if (!menuOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav
      className="site-nav"
      data-scrolled={scrolled || menuOpen ? "true" : "false"}
      aria-label="Primary navigation"
    >
      <Link className="brand" href="/" scroll={false}>
        {/* Two artworks, one per bar state: white wordmark over the dark hero,
            dark wordmark on the light scrolled bar. CSS swaps them. */}
        <Image
          className="brand-on-dark"
          src="/brand/atelier-logo-on-dark.png"
          alt="Atelier Living Group"
          width={1600}
          height={595}
          priority
        />
        <Image
          className="brand-on-light"
          src="/brand/atelier-logo-on-light.png"
          alt=""
          aria-hidden="true"
          width={1600}
          height={597}
          priority
        />
      </Link>

      <div className="nav-links">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            scroll={false}
            aria-current={isActive(link.href) ? "page" : undefined}
          >
            {link.label}
          </Link>
        ))}
        <Link className="nav-cta" href="/contact#enquiry" scroll={false}>
          Book a Private Consultation
        </Link>
      </div>

      <button
        type="button"
        className="nav-toggle"
        aria-expanded={menuOpen}
        aria-controls="site-menu"
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
      </button>

      <div className="nav-drawer" id="site-menu" data-open={menuOpen}>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            scroll={false}
            aria-current={isActive(link.href) ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/contact#enquiry"
          scroll={false}
          onClick={() => setMenuOpen(false)}
        >
          Book a Private Consultation
        </Link>
        <a href={phoneHref} onClick={() => setMenuOpen(false)}>
          {phone}
        </a>
      </div>
    </nav>
  );
}
