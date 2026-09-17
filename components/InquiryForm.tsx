"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Variant = "hero" | "consultation" | "footer";

type FieldName =
  | "name"
  | "email"
  | "phone"
  | "contact"
  | "projectType"
  | "message";

type FieldDef = {
  name: FieldName;
  label: string;
  type: "text" | "email" | "tel" | "select" | "textarea";
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  options?: string[];
  /** Span both columns in the two-up consultation layout. */
  full?: boolean;
};

const PROJECT_OPTIONS_FULL = [
  "Private residence",
  "Luxury kitchen design-build",
  "Premium kitchen remodeling",
  "Fully custom German cabinetry",
  "High-end appliance planning",
  "Architect / designer collaboration",
  "Developer or custom builder inquiry",
  "Showroom appointment",
];

const PROJECT_OPTIONS_SHORT = [
  "Luxury kitchen design",
  "Custom German cabinetry",
  "High-end appliance planning",
  "Premium remodeling",
  "Showroom appointment",
];

const PROJECT_OPTIONS_FOOTER = [
  "Showroom appointment",
  "Luxury kitchen design-build",
  "Custom cabinetry",
  "High-end appliances",
  "Premium remodeling",
];

const VARIANTS: Record<
  Variant,
  {
    eyebrow?: string;
    title?: string;
    note?: string;
    submit: string;
    fields: FieldDef[];
    /** Two-column field grid on wider screens. */
    twoUp?: boolean;
  }
> = {
  hero: {
    eyebrow: "Private consultation",
    title: "Start the conversation",
    note: "We reply within one business day.",
    submit: "Request consultation",
    fields: [
      {
        name: "name",
        label: "Name",
        type: "text",
        placeholder: "Your name",
        autoComplete: "name",
        required: true,
      },
      {
        name: "phone",
        label: "Phone",
        type: "tel",
        placeholder: "Best number",
        autoComplete: "tel",
        required: true,
      },
      {
        name: "projectType",
        label: "Project focus",
        type: "select",
        options: PROJECT_OPTIONS_SHORT,
      },
    ],
  },
  consultation: {
    submit: "Request consultation",
    twoUp: true,
    fields: [
      {
        name: "name",
        label: "Name",
        type: "text",
        placeholder: "Your name",
        autoComplete: "name",
        required: true,
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "you@example.com",
        autoComplete: "email",
        required: true,
      },
      {
        name: "projectType",
        label: "Project type",
        type: "select",
        options: PROJECT_OPTIONS_FULL,
        full: true,
      },
      {
        name: "message",
        label: "Message",
        type: "textarea",
        placeholder:
          "A few details about the space, timeline or design intent.",
        full: true,
      },
    ],
  },
  footer: {
    eyebrow: "Book a showroom visit",
    submit: "Request appointment",
    fields: [
      {
        name: "name",
        label: "Name",
        type: "text",
        placeholder: "Your name",
        autoComplete: "name",
        required: true,
      },
      {
        name: "contact",
        label: "Email or phone",
        type: "text",
        placeholder: "How should we reach you?",
        autoComplete: "email",
        required: true,
      },
      {
        name: "projectType",
        label: "Project",
        type: "select",
        options: PROJECT_OPTIONS_FOOTER,
      },
    ],
  },
};

type Errors = Partial<Record<string, string>>;

export default function InquiryForm({
  variant,
  className,
  ariaLabel,
}: {
  variant: Variant;
  className?: string;
  ariaLabel: string;
}) {
  const config = VARIANTS[variant];
  // Deterministic ids: useId() mismatches between server and client under
  // vinext 1.0.0-beta.2. Each variant appears at most once per page.
  const uid = `alg-${variant}`;
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [formMessage, setFormMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const data = new FormData(event.currentTarget);
    const read = (key: string) => String(data.get(key) ?? "").trim();

    // The footer takes one "email or phone" field; split it for the API.
    const contact = read("contact");
    const isEmailContact = contact.includes("@");

    const body = {
      source: variant,
      name: read("name"),
      email: read("email") || (isEmailContact ? contact : ""),
      phone: read("phone") || (!isEmailContact ? contact : ""),
      projectType: read("projectType"),
      message: read("message"),
      company: read("company"),
    };

    setStatus("sending");
    setErrors({});
    setFormMessage("");

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        errors?: Errors;
        message?: string;
      };

      if (response.ok && result.ok) {
        setStatus("sent");
        formRef.current?.reset();
        return;
      }

      // Map the API's email/phone errors back onto the footer's single field.
      const next: Errors = { ...(result.errors ?? {}) };
      if (variant === "footer" && (next.email || next.phone)) {
        next.contact = next.email ?? next.phone;
        delete next.email;
        delete next.phone;
      }
      setErrors(next);
      setFormMessage(
        result.message ?? "Something went wrong. Please try again.",
      );
      setStatus("idle");
    } catch {
      setFormMessage(
        "We could not reach the server. Please check your connection or call 678-637-3262.",
      );
      setStatus("idle");
    }
  }

  // Move focus to the first field that failed. This has to wait for the
  // re-render: while status is "sending" the inputs are still disabled in the
  // DOM, and a disabled element cannot take focus.
  useEffect(() => {
    const firstBad = Object.keys(errors)[0];
    if (!firstBad || status !== "idle") return;
    const el = formRef.current?.querySelector<HTMLElement>(
      `#${CSS.escape(`${uid}-${firstBad}`)}`,
    );
    el?.focus();
  }, [errors, status, uid]);

  if (status === "sent") {
    return (
      <div className={className}>
        <div className="grid gap-3 border-t border-border pt-7" role="status">
          <span className="flex size-9 items-center justify-center border border-current text-current">
            <Check className="size-4" />
          </span>
          <h3 className="font-serif text-2xl leading-tight text-current">
            Thank you — your request is with us.
          </h3>
          <p className="text-[15px] leading-relaxed opacity-80">
            A member of Atelier Living Group will be in touch shortly to arrange
            your private consultation. For anything urgent, call{" "}
            <a className="border-b border-current" href="tel:+16786373262">
              678-637-3262
            </a>
            .
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2 justify-self-start"
            onClick={() => setStatus("idle")}
          >
            Send another request
          </Button>
        </div>
      </div>
    );
  }

  const busy = status === "sending";

  return (
    <form
      ref={formRef}
      className={cn("grid", className)}
      aria-label={ariaLabel}
      onSubmit={handleSubmit}
      noValidate
    >
      {config.eyebrow ? (
        <p className="mb-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {config.eyebrow}
        </p>
      ) : null}
      {config.title ? (
        <h3 className="mb-6 font-serif text-[27px] leading-tight text-foreground">
          {config.title}
        </h3>
      ) : null}

      <div
        className={cn(
          "grid gap-5",
          config.twoUp && "sm:grid-cols-2 sm:gap-x-8",
        )}
      >
        {config.fields.map((field) => {
          const id = `${uid}-${field.name}`;
          const error = errors[field.name];
          const describedBy = error ? `${id}-error` : undefined;

          return (
            <Field
              key={field.name}
              id={id}
              label={field.label}
              error={error}
              required={field.required}
              className={cn(field.full && "sm:col-span-2")}
            >
              {field.type === "select" ? (
                <Select name={field.name} defaultValue={field.options?.[0]}>
                  <SelectTrigger
                    id={id}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={describedBy}
                  >
                    <SelectValue placeholder="Select one" />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === "textarea" ? (
                <Textarea
                  id={id}
                  name={field.name}
                  placeholder={field.placeholder}
                  disabled={busy}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={describedBy}
                />
              ) : (
                <Input
                  id={id}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                  required={field.required}
                  disabled={busy}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={describedBy}
                />
              )}
            </Field>
          );
        })}
      </div>

      {/* Bot trap. Hidden from sight and from assistive tech, not from bots. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor={`${uid}-company`}>Company</label>
        <input
          id={`${uid}-company`}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <Button type="submit" disabled={busy} className="mt-7 w-full">
        {busy ? (
          <>
            <Loader2 className="animate-spin" />
            Sending
          </>
        ) : (
          <>
            {config.submit}
            <ArrowRight />
          </>
        )}
      </Button>

      {config.note && !formMessage ? (
        <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          {config.note}
        </p>
      ) : null}

      <p
        className="mt-3 text-[13px] leading-relaxed text-destructive empty:mt-0"
        role="alert"
      >
        {formMessage}
      </p>
    </form>
  );
}
