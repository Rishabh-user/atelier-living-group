"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Underline field rather than a boxed input: keeps the editorial,
 * architectural feel of the site instead of shadcn's default bordered box.
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
        "w-full min-h-11 bg-transparent px-0 py-2 text-[15px] text-foreground rounded-none",
        "border-0 border-b transition-colors",
        invalid ? "border-destructive" : "border-input",
        "placeholder:text-muted-foreground/70",
        "focus:outline-none focus:border-b-foreground",
        "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
        "disabled:opacity-55 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
