"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Square, uppercase, wide-tracked: the ALG button language.
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-[11px] uppercase tracking-[0.16em] font-normal transition-colors cursor-pointer disabled:pointer-events-none disabled:opacity-55 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ring [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border border-primary hover:bg-transparent hover:text-primary",
        outline:
          "border border-current bg-transparent hover:bg-foreground/8",
        light:
          "bg-off-white text-ink border border-off-white hover:bg-transparent hover:text-off-white",
        ghost: "border border-current bg-transparent text-white hover:bg-white/14",
        link: "underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-[50px] px-5 py-4",
        wide: "min-h-[52px] min-w-[210px] px-6 py-4",
        sm: "min-h-[40px] px-4 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
