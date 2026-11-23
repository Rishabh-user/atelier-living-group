"use client";

import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, Phone, X } from "lucide-react";

import {
  catalogHref,
  collectionCards,
  navLinks,
  phone,
  phoneHref,
} from "@/content/site";
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
  // The Poggenpohl panel. Opened by hovering or focusing its link and closed by
  // leaving the bar, so the pointer can travel from the link down into the panel.
  const [megaOpen, setMegaOpen] = useState(false);

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

  useEffect(() => {
    if (!megaOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMegaOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [megaOpen]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav
      className="site-nav"
      data-scrolled={
        alwaysSolid || scrolled || menuOpen || megaOpen ? "true" : "false"
      }
      aria-label="Primary navigation"
      onMouseLeave={() => setMegaOpen(false)}
    >
      <Link
        className="brand"
        href="/"
        scroll={false}
        onClick={(event) => {
          setMenuOpen(false);
          // Already on the homepage: a same-URL link does nothing, so scroll up.
          if (pathname === "/") {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
      >
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
        {navLinks.map((link) => {
          const hasMega = link.href === "/poggenpohl";
          return (
            <Link
              key={link.href}
              href={link.href}
              scroll={false}
              aria-current={isActive(link.href) ? "page" : undefined}
              aria-haspopup={hasMega ? "true" : undefined}
              aria-expanded={hasMega ? megaOpen : undefined}
              onMouseEnter={() => setMegaOpen(hasMega)}
              onFocus={() => setMegaOpen(hasMega)}
            >
              {link.label}
            </Link>
          );
        })}
        <a className="nav-cta nav-phone" href={phoneHref}>
          <Phone aria-hidden="true" />
          {phone}
        </a>
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


      <div
        className="mega"
        data-open={megaOpen}
        aria-hidden={!megaOpen}
        onFocus={() => setMegaOpen(true)}
      >
        <div className="mega-inner">
          <div className="mega-col">
            <p className="mega-title">Collections</p>
            <ul>
              {collectionCards.map((card) => (
                <li key={card.href}>
                  <Link
                    href={card.href}
                    scroll={false}
                    tabIndex={megaOpen ? 0 : -1}
                    onClick={() => setMegaOpen(false)}
                  >
                    {card.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mega-col">
            <p className="mega-title">Inspiration</p>
            <ul>
              <li>
                <Link
                  href="/materials"
                  scroll={false}
                  tabIndex={megaOpen ? 0 : -1}
                  onClick={() => setMegaOpen(false)}
                >
                  Colours &amp; Materiality
                </Link>
              </li>
              <li>
                <Link
                  href="/our-work"
                  scroll={false}
                  tabIndex={megaOpen ? 0 : -1}
                  onClick={() => setMegaOpen(false)}
                >
                  Our Work
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  scroll={false}
                  tabIndex={megaOpen ? 0 : -1}
                  onClick={() => setMegaOpen(false)}
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div className="mega-col">
            <p className="mega-title">Poggenpohl</p>
            <ul>
              <li>
                <Link
                  href="/poggenpohl"
                  scroll={false}
                  tabIndex={megaOpen ? 0 : -1}
                  onClick={() => setMegaOpen(false)}
                >
                  All collections
                </Link>
              </li>
              <li>
                <Link
                  href="/showroom"
                  scroll={false}
                  tabIndex={megaOpen ? 0 : -1}
                  onClick={() => setMegaOpen(false)}
                >
                  Our showroom
                </Link>
              </li>
            </ul>
          </div>

          <Link
            className="mega-card"
            href={catalogHref}
            scroll={false}
            tabIndex={megaOpen ? 0 : -1}
            onClick={() => setMegaOpen(false)}
          >
            <Image
              src="/products/segmento/segmento-07.jpg"
              alt=""
              fill
              sizes="300px"
            />
            <span className="mega-card-copy">
              <strong>View the Catalogue</strong>
              <span>
                More <ArrowRight aria-hidden="true" />
              </span>
            </span>
          </Link>

          <Link
            className="mega-card"
            href="/contact?interest=visit#enquiry"
            scroll={false}
            tabIndex={megaOpen ? 0 : -1}
            onClick={() => setMegaOpen(false)}
          >
            <Image
              src="/showroom/system-in-the-room.jpg"
              alt=""
              fill
              sizes="300px"
            />
            <span className="mega-card-copy">
              <strong>Request a meeting</strong>
              <span>
                More <ArrowRight aria-hidden="true" />
              </span>
            </span>
          </Link>
        </div>
      </div>

      <div className="nav-drawer" id="site-menu" data-open={menuOpen}>
        {navLinks.map((link) => (
          <Fragment key={link.href}>
            <Link
              href={link.href}
              scroll={false}
              aria-current={isActive(link.href) ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
            {link.href === "/poggenpohl" ? (
              <div className="nav-drawer-sub">
                {collectionCards.map((card) => (
                  <Link
                    key={card.href}
                    href={card.href}
                    scroll={false}
                    onClick={() => setMenuOpen(false)}
                  >
                    {card.name}
                  </Link>
                ))}
                <Link
                  href="/materials"
                  scroll={false}
                  onClick={() => setMenuOpen(false)}
                >
                  Colours &amp; Materiality
                </Link>
              </div>
            ) : null}
          </Fragment>
        ))}
        <a href={phoneHref} onClick={() => setMenuOpen(false)}>
          {phone}
        </a>
      </div>
    </nav>
  );
}
