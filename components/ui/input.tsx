"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Softly filled, square-cornered field: a quiet tint and a hairline border
 * that warms to the accent on focus, in keeping with the site's editorial look.
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  // Pick the border colour explicitly. `border-input` is a border-color
  // shorthand and would fight an `aria-invalid:border-b-*` longhand in the
  // cascade, so only one of the two is ever emitted.
  const invalid =
    props["aria-invalid"] === true || props["aria-invalid"] === "true";

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full min-h-12 bg-foreground/[0.04] px-4 py-3 text-[15px] text-foreground rounded-none",
        "border transition-colors",
        invalid ? "border-destructive" : "border-input/50",
        "placeholder:text-muted-foreground/70",
        "hover:border-foreground/40",
        "focus:outline-none focus:border-ring focus:bg-foreground/[0.02] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--ring)_28%,transparent)]",
        "disabled:opacity-55 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
