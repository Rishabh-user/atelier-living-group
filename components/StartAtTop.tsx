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
 * URLs with a hash scroll to their target instead. Links here use
 * scroll={false}, which stops the router doing that itself, so it is done
 * below once the new page has rendered (it can take a frame or two).
 */
export default function StartAtTop() {
  const pathname = usePathname();

  useIsomorphicLayoutEffect(() => {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (hash) {
      let tries = 0;
      let frame = 0;
      const seek = () => {
        const target = document.getElementById(hash);
        if (target) {
          target.scrollIntoView({ block: "start", behavior: "instant" });
        } else if (tries++ < 30) {
          frame = requestAnimationFrame(seek);
        }
      };
      seek();
      return () => cancelAnimationFrame(frame);
    }
    // "instant" so this is never animated, whatever scroll-behavior is set to.
    const top = () =>
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    top();
    // The new page can still be settling (the old one is unmounting, images are
    // being laid out), which can leave a few pixels of the old offset. Repeat
    // for two frames so the page reliably starts at 0.
    let frame = requestAnimationFrame(() => {
      top();
      frame = requestAnimationFrame(top);
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
