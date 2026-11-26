"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Loader2, Mail, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import Link from "next/link";

import { phone, phoneHref } from "@/content/site";
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

/** Where the form sits; stored with the enquiry so leads can be traced. */
type Source = "home" | "contact" | "page";

type FieldName =
  | "name"
  | "email"
  | "phone"
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
  /** Leading icon inside a text field. */
  icon?: LucideIcon;
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

const FORM: {
  submit: string;
  fields: FieldDef[];
  /** Two-column field grid on wider screens. */
  twoUp?: boolean;
} = {
    submit: "Let’s Talk",
    twoUp: true,
    fields: [
      {
        name: "name",
        label: "Name",
        type: "text",
        placeholder: "Your name",
        autoComplete: "name",
        required: true,
        icon: User,
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "you@example.com",
        autoComplete: "email",
        required: true,
        icon: Mail,
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
  };

type Errors = Partial<Record<string, string>>;

export default function InquiryForm({
  source,
  className,
  ariaLabel,
  defaultProjectType,
  lockedProjectType,
}: {
  source: Source;
  className?: string;
  ariaLabel: string;
  /** Preselects a project type when it is one of the select's options. */
  defaultProjectType?: string;
  /** When set, the project-type field is not shown and this value is submitted. */
  lockedProjectType?: string;
}) {
  const config = FORM;
  // Deterministic ids rather than useId(). Each variant appears at most once
  // per page, so these are unique, and stable ids keep the aria-describedby
  // wiring readable in the DOM.
  const uid = `alg-${source}`;
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [formMessage, setFormMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const data = new FormData(event.currentTarget);
    const read = (key: string) => String(data.get(key) ?? "").trim();

    const body = {
      source,
      name: read("name"),
      email: read("email"),
      phone: read("phone"),
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

      setErrors(result.errors ?? {});
      setFormMessage(
        result.message ?? "Something went wrong. Please try again.",
      );
      setStatus("idle");
    } catch {
      setFormMessage(
        `We could not reach the server. Please check your connection or call ${phone}.`,
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

  const Title = "h3";

  if (status === "sent") {
    return (
      <div className={className}>
        <div className="grid gap-3 border-t border-border pt-7" role="status">
          <span className="flex size-9 items-center justify-center border border-current text-current">
            <Check className="size-4" />
          </span>
          <Title className="font-serif text-2xl leading-tight text-current">
            Thank you — your request is with us.
          </Title>
          <p className="text-[15px] leading-relaxed opacity-80">
            A member of Atelier Living Group will be in touch shortly to arrange
            your private consultation. For anything urgent, call{" "}
            <a className="border-b border-current" href={phoneHref}>
              {phone}
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
      <div
        className={cn(
          "grid gap-5",
          config.twoUp && "sm:grid-cols-2 sm:gap-x-8",
        )}
      >
        {lockedProjectType ? (
          <input type="hidden" name="projectType" value={lockedProjectType} />
        ) : null}
        {config.fields
          .filter((field) => !(lockedProjectType && field.name === "projectType"))
          .map((field) => {
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
                <Select
                  name={field.name}
                  defaultValue={
                    defaultProjectType && field.options?.includes(defaultProjectType)
                      ? defaultProjectType
                      : field.options?.[0]
                  }
                >
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
                <div className="relative">
                  {field.icon ? (
                    <field.icon
                      aria-hidden="true"
                      className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    />
                  ) : null}
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
                    className={field.icon ? "pl-11" : undefined}
                  />
                </div>
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

      <Button type="submit" disabled={busy} size="wide" className="mt-8 w-full min-h-[56px]">
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

      <p className="form-privacy">
        <Link href="/privacy" scroll={false}>
          Privacy Policy
        </Link>
      </p>

      <p
        className="mt-3 text-[13px] leading-relaxed text-destructive empty:mt-0"
        role="alert"
      >
        {formMessage}
      </p>
    </form>
  );
}
