"use client";

import { useEffect, useState } from "react";
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
 */
export default function SiteNav() {
  const pathname = usePathname();
  // Only the homepage has a dark full-bleed hero behind the bar.
  const alwaysSolid = pathname !== "/";

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

    const hero = document.getElementById("top");

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

    const threshold = () =>
      hero ? Math.max(0, hero.offsetHeight - navHeight()) : 24;

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
  }, [alwaysSolid]);

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
      <Link className="brand" href="/">
        <img
          src="/alg-mark.png"
          alt="Atelier Living Group"
          width={260}
          height={205}
        />
        <span>Atelier Living Group</span>
      </Link>

      <div className="nav-links">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive(link.href) ? "page" : undefined}
          >
            {link.label}
          </Link>
        ))}
        <a className="nav-phone" href={phoneHref}>
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

      <div className="nav-drawer" id="site-menu" data-open={menuOpen}>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive(link.href) ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <a href={phoneHref} onClick={() => setMenuOpen(false)}>
          {phone}
        </a>
      </div>
    </nav>
  );
}
