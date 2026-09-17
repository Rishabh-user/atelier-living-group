"use client";

import { usePathname } from "next/navigation";

import { useIsomorphicLayoutEffect } from "@/lib/use-isomorphic-layout-effect";

/**
 * Open every page at the top.
 *
 * Two separate problems, both of which made a page appear to start part-way
 * down:
 *
 * 1. Browsers default to `history.scrollRestoration = "auto"`, so reloading an
 *    inner page put you back where you had scrolled to.
 * 2. Setting that to "manual" is the usual cure, but here it made the App
 *    Router scroll the new page down by ~639px after arrival. Leaving
 *    scrollRestoration alone and simply resetting the scroll ourselves fixes
 *    the reload without disturbing route navigation.
 *
 * The reset runs on every pathname change, and on mount, in a layout effect -
 * before paint, so the page is never shown at the old offset.
 *
 * URLs with a hash are left alone, so /#consultation and #enquiry still work.
 */
export default function StartAtTop() {
  const pathname = usePathname();

  useIsomorphicLayoutEffect(() => {
    if (window.location.hash) return;
    // "instant" so this is never animated, whatever scroll-behavior is set to.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
