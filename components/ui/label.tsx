"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "@/lib/utils";

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/75 select-none",
        "group-data-[invalid=true]/field:text-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
