"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import InquiryForm from "@/components/InquiryForm";

/** Label shown to the visitor, and the project type stored with the enquiry. */
const options = [
  { label: "A new luxury kitchen", projectType: "Luxury kitchen design-build" },
  { label: "A kitchen renovation", projectType: "Premium kitchen remodeling" },
  {
    label: "Architect / designer / builder collaboration",
    projectType: "Architect / designer collaboration",
  },
  { label: "A private showroom visit", projectType: "Showroom appointment" },
];

/**
 * The homepage consultation, in two steps on one screen: choose what you are
 * interested in, then the short form opens in the same place with that choice
 * already recorded. Nothing navigates away.
 */
export default function ConsultationInvite() {
  const [choice, setChoice] = useState<number | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const shownChoice = useRef<number | null>(null);

  // Move focus into the new step so keyboard and screen-reader users follow it.
  // Only when the step actually changed: focusing on page load would scroll the
  // whole page down to this section.
  useEffect(() => {
    if (shownChoice.current === choice) return;
    shownChoice.current = choice;
    panel.current?.focus();
  }, [choice]);

  const selected = choice === null ? null : options[choice];

  return (
    <div className="invite" data-step={selected ? 2 : 1}>
      <p className="invite-steps" aria-hidden="true">
        <span data-on={!selected}>01 Interest</span>
        <i />
        <span data-on={Boolean(selected)}>02 Your details</span>
      </p>

      <div className="invite-panel" ref={panel} tabIndex={-1}>
        {!selected ? (
          <fieldset>
            <legend>I&apos;m interested in</legend>
            <div className="invite-options">
              {options.map((option, i) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => setChoice(i)}
                >
                  <span>{option.label}</span>
                  <ArrowRight aria-hidden="true" />
                </button>
              ))}
            </div>
          </fieldset>
        ) : (
          <div className="invite-form surface-dark">
            <div className="invite-chosen">
              <span>
                <small>I&apos;m interested in</small>
                {selected.label}
              </span>
              <button type="button" onClick={() => setChoice(null)}>
                <ArrowLeft aria-hidden="true" />
                Change
              </button>
            </div>
            <InquiryForm
              source="home"
              ariaLabel="Homepage consultation request"
              lockedProjectType={selected.projectType}
            />
          </div>
        )}
      </div>
    </div>
  );
}
