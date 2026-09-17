"use client";

import * as React from "react";

import { useIsomorphicLayoutEffect } from "@/lib/use-isomorphic-layout-effect";

/**
 * Counts up to `value` when the number scrolls into view.
 *
 * The final value is rendered on the server, so without JavaScript (or when
 * the observer never fires, as in a backgrounded tab) the correct figure is
 * simply shown straight away. The animation is an enhancement, never the
 * source of the number.
 */
export default function Counter({
  value,
  suffix = "",
  duration = 1100,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = React.useState(value);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (
      reducedMotion ||
      typeof IntersectionObserver !== "function" ||
      typeof requestAnimationFrame !== "function"
    ) {
      return;
    }

    let frame = 0;
    let settle = 0;
    let started = false;

    const run = () => {
      if (started) return;
      started = true;
      const start = performance.now();

      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(Math.round(eased * value));
        if (t < 1) {
          frame = requestAnimationFrame(tick);
        } else {
          window.clearTimeout(settle);
        }
      };

      // Guarantee the real figure even if rAF never runs to completion.
      // Browsers suspend rAF in backgrounded tabs, which would otherwise
      // freeze the counter at whatever value it had reached - including 0.
      settle = window.setTimeout(() => {
        if (frame) cancelAnimationFrame(frame);
        setDisplay(value);
      }, duration + 400);

      setDisplay(0);
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          run();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
      if (settle) window.clearTimeout(settle);
    };
  }, [value, duration]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}
