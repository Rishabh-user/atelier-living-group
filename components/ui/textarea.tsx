"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  const invalid =
    props["aria-invalid"] === true || props["aria-invalid"] === "true";

  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "w-full min-h-28 resize-y bg-foreground/[0.04] px-4 py-3 text-[15px] text-foreground rounded-none",
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

export { Textarea };
