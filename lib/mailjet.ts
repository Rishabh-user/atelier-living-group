/**
 * Mailjet (Send API v3.1) for consultation enquiries.
 *
 * Server only. Every setting comes from the environment, so nothing here needs
 * editing to change the sender, the recipient or the keys:
 *
 *   MAILJET_API_KEY     Mailjet "API Key"
 *   MAILJET_SECRET_KEY  Mailjet "Secret Key"
 *   MAIL_FROM_EMAIL     Sender. Must be a sender/domain verified in Mailjet.
 *   MAIL_FROM_NAME      Sender display name.
 *   MAIL_TO             Where enquiries are delivered (comma-separated allowed).
 *   MAIL_AUTOREPLY      "false" turns off the confirmation sent to the visitor.
 *   MAILJET_SANDBOX     "true" makes Mailjet validate the request without
 *                       sending anything (for testing).
 *   MAILJET_API_URL     Override for tests only.
 *
 * No SDK: one fetch call keeps the dependency list unchanged.
 */

import { phone } from "@/content/site";

export type Enquiry = {
  /** Which form it came from: home, contact or page. */
  source: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
};

const DEFAULT_API_URL = "https://api.mailjet.com/v3.1/send";
const DEFAULT_ADDRESS = "hi@atelierlivinggroup.com";
const SITE_NAME = "Atelier Living Group";

const sourceLabels: Record<string, string> = {
  home: "Homepage consultation",
  contact: "Contact page",
  page: "Consultation form",
};

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

/** True when both Mailjet keys are present. */
export function isMailConfigured(): boolean {
  return Boolean(env("MAILJET_API_KEY") && env("MAILJET_SECRET_KEY"));
}

/** Names used in subjects and headers must never contain line breaks. */
function oneLine(value: string): string {
  return value.replace(/[\r\n\t]+/g, " ").trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function recipients(): { Email: string }[] {
  const list = (env("MAIL_TO") || DEFAULT_ADDRESS)
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
  return list.map((Email) => ({ Email }));
}

function teamMessage(enquiry: Enquiry, from: { Email: string; Name: string }) {
  const rows: [string, string][] = [
    ["Name", enquiry.name],
    ["Email", enquiry.email || "—"],
    ["Phone", enquiry.phone || "—"],
    ["Interested in", enquiry.projectType || "—"],
    ["Form", sourceLabels[enquiry.source] ?? enquiry.source],
  ];
  const message = enquiry.message || "(no message)";

  const text = [
    `New enquiry from ${enquiry.name}`,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Message:",
    message,
  ].join("\n");

  const html = `
<div style="font-family:Arial,Helvetica,sans-serif;color:#111;max-width:560px">
  <h2 style="font-family:Georgia,serif;font-weight:500;margin:0 0 16px">New enquiry</h2>
  <table style="border-collapse:collapse;width:100%">
    ${rows
      .map(
        ([label, value]) =>
          `<tr><td style="padding:8px 12px 8px 0;color:#666;width:130px;vertical-align:top">${escapeHtml(label)}</td><td style="padding:8px 0;border-bottom:1px solid #eee">${escapeHtml(value)}</td></tr>`,
      )
      .join("")}
  </table>
  <p style="color:#666;margin:20px 0 6px">Message</p>
  <p style="white-space:pre-wrap;margin:0;line-height:1.6">${escapeHtml(message)}</p>
  ${enquiry.email ? `<p style="color:#888;font-size:12px;margin-top:24px">Reply to this email to answer ${escapeHtml(enquiry.name)} directly.</p>` : ""}
</div>`;

  return {
    From: from,
    To: recipients(),
    // Replying goes straight to the visitor.
    ...(enquiry.email
      ? { ReplyTo: { Email: enquiry.email, Name: oneLine(enquiry.name) } }
      : {}),
    Subject: oneLine(
      `New enquiry: ${enquiry.projectType || "Consultation"} — ${enquiry.name}`,
    ),
    TextPart: text,
    HTMLPart: html,
    CustomID: "enquiry-team",
  };
}

function autoReply(enquiry: Enquiry, from: { Email: string; Name: string }) {
  const first = oneLine(enquiry.name).split(" ")[0] || "there";
  const text = [
    `Hello ${first},`,
    "",
    `Thank you for contacting ${SITE_NAME}. We have your enquiry${enquiry.projectType ? ` about ${enquiry.projectType.toLowerCase()}` : ""} and will reply within one business day.`,
    phone ? `\nFor anything urgent, call ${phone}.` : "",
    "",
    "Spaces That Inspire",
    SITE_NAME,
  ].join("\n");

  const html = `
<div style="font-family:Arial,Helvetica,sans-serif;color:#111;max-width:520px;line-height:1.7">
  <p>Hello ${escapeHtml(first)},</p>
  <p>Thank you for contacting ${SITE_NAME}. We have your enquiry${enquiry.projectType ? ` about ${escapeHtml(enquiry.projectType.toLowerCase())}` : ""} and will reply within one business day.</p>
  ${phone ? `<p>For anything urgent, call ${escapeHtml(phone)}.</p>` : ""}
  <p style="margin-top:28px;font-family:Georgia,serif;font-style:italic;color:#8a7250">Spaces That Inspire<br><span style="font-style:normal;color:#111">${SITE_NAME}</span></p>
</div>`;

  return {
    From: from,
    To: [{ Email: enquiry.email, Name: oneLine(enquiry.name) }],
    Subject: `We have received your enquiry — ${SITE_NAME}`,
    TextPart: text,
    HTMLPart: html,
    CustomID: "enquiry-autoreply",
  };
}

/**
 * Sends the team notification and, when the visitor left an email address, a
 * confirmation. Resolves true only if Mailjet accepted the team notification.
 */
export async function sendEnquiryEmails(enquiry: Enquiry): Promise<boolean> {
  const from = {
    Email: env("MAIL_FROM_EMAIL") || DEFAULT_ADDRESS,
    Name: env("MAIL_FROM_NAME") || SITE_NAME,
  };

  const messages: unknown[] = [teamMessage(enquiry, from)];
  if (enquiry.email && env("MAIL_AUTOREPLY").toLowerCase() !== "false") {
    messages.push(autoReply(enquiry, from));
  }

  const response = await fetch(env("MAILJET_API_URL") || DEFAULT_API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization:
        "Basic " +
        Buffer.from(
          `${env("MAILJET_API_KEY")}:${env("MAILJET_SECRET_KEY")}`,
        ).toString("base64"),
    },
    body: JSON.stringify({
      Messages: messages,
      ...(env("MAILJET_SANDBOX").toLowerCase() === "true"
        ? { SandboxMode: true }
        : {}),
    }),
    signal: AbortSignal.timeout(10_000),
  });

  const result = (await response.json().catch(() => ({}))) as {
    Messages?: { Status?: string; CustomID?: string; Errors?: unknown[] }[];
  };

  const team = result.Messages?.find((m) => m.CustomID === "enquiry-team");
  if (!response.ok || team?.Status !== "success") {
    console.error("mailjet rejected the enquiry email", {
      status: response.status,
      result: JSON.stringify(result).slice(0, 800),
    });
    return false;
  }

  const reply = result.Messages?.find((m) => m.CustomID === "enquiry-autoreply");
  if (reply && reply.Status !== "success") {
    // The team email went out; a failed confirmation is only worth a log line.
    console.error("mailjet auto-reply failed", JSON.stringify(reply.Errors));
  }
  return true;
}
