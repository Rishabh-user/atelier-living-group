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
        "w-full min-h-28 resize-y bg-transparent px-0 py-2 text-[15px] text-foreground rounded-none",
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

export { Textarea };
