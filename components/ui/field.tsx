"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

/**
 * Label + control + inline error, wired for accessibility:
 * the control is described by the error, and `data-invalid` on the group
 * lets the label and control restyle together.
 */
function Field({
  id,
  label,
  error,
  required,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("group/field grid gap-2", className)}
      data-invalid={error ? "true" : undefined}
    >
      <Label htmlFor={id}>
        {label}
        {required ? (
          <span aria-hidden="true" className="text-destructive">
            {" *"}
          </span>
        ) : null}
      </Label>

      {children}

      {error ? (
        <p
          id={`${id}-error`}
          className="text-[11px] leading-snug tracking-normal normal-case text-destructive"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

export { Field };
