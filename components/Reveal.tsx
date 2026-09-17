"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

import { useIsomorphicLayoutEffect } from "@/lib/use-isomorphic-layout-effect";

/**
 * Fade-and-rise a block into view as it enters the viewport.
 *
 * Content is visible by default and only hidden once the effect has confirmed
 * it can reveal it again, so the page still reads with JavaScript disabled or
 * broken. A failsafe timer reveals everything if the observer never delivers a
 * callback at all - which happens in backgrounded tabs, where browsers suspend
 * IntersectionObserver entirely.
 */
export default function Reveal({
  children,
  className,
  as: Tag = "div",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "li";
  delay?: number;
}) {
  const ref = React.useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reveal = () => {
      el.dataset.reveal = "shown";
    };

    const reducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion || typeof IntersectionObserver !== "function") {
      reveal();
      return;
    }

    // Safe to hide now: we know we have a way to bring it back.
    el.dataset.reveal = "hidden";

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      window.clearTimeout(failsafe);
      observer.disconnect();
      reveal();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) finish();
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );

    // If no callback ever arrives, show the content rather than lose it.
    const failsafe = window.setTimeout(finish, 1200);

    observer.observe(el);

    return () => {
      window.clearTimeout(failsafe);
      observer.disconnect();
    };
  }, []);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={cn("alg-reveal", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
