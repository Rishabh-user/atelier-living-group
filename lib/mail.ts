/**
 * Gmail (SMTP) for consultation enquiries.
 *
 * Server only. Every setting comes from the environment, so nothing here needs
 * editing to change the account, the recipient or the password:
 *
 *   GMAIL_USER          The Gmail / Google Workspace address that sends.
 *   GMAIL_APP_PASSWORD  A 16-character Google "App password" for that account
 *                       (not the normal sign-in password). Spaces are ignored.
 *   MAIL_FROM_NAME      Sender display name.
 *   MAIL_TO             Where enquiries are delivered (comma-separated allowed).
 *                       Defaults to GMAIL_USER.
 *   MAIL_AUTOREPLY      "false" turns off the confirmation sent to the visitor.
 *   GMAIL_SMTP_HOST     Override for tests only (default smtp.gmail.com).
 *   GMAIL_SMTP_PORT     Override for tests only (default 465).
 *
 * Gmail always sends from the signed-in account, so the From address is
 * GMAIL_USER.
 */

import nodemailer from "nodemailer";

import {
  address,
  hours,
  phone,
  phoneHref,
  siteUrl,
} from "@/content/site";

export type Enquiry = {
  /** Which form it came from: home, contact or page. */
  source: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
};

const SITE_NAME = "Atelier Living Group";

const sourceLabels: Record<string, string> = {
  home: "Homepage consultation",
  contact: "Contact page",
  page: "Consultation form",
};

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

/** True when the Gmail address and its app password are both present. */
export function isMailConfigured(): boolean {
  return Boolean(env("GMAIL_USER") && env("GMAIL_APP_PASSWORD"));
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

function recipients(): string[] {
  const list = (env("MAIL_TO") || env("GMAIL_USER"))
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
  return list;
}

// ---------------------------------------------------------------------------
// Templates. Email clients ignore most modern CSS, so these are table based with
// inline styles, a fixed 600 px column and system fonts.
// ---------------------------------------------------------------------------

const INK = "#111111";
const MUTED = "#6b665e";
const GOLD = "#a8895a";
const PAPER = "#f4f1ea";
const LINE = "#e4dfd4";
const SERIF = "Georgia,'Times New Roman',serif";
const SANS = "Arial,Helvetica,sans-serif";

const link = (href: string, label: string, color = INK) =>
  `<a href="${escapeHtml(href)}" style="color:${color};text-decoration:underline">${escapeHtml(label)}</a>`;

const button = (href: string, label: string, dark = true) =>
  `<a href="${escapeHtml(href)}" style="display:inline-block;background:${dark ? INK : "#ffffff"};color:${dark ? "#ffffff" : INK};border:1px solid ${INK};font-family:${SANS};font-size:12px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:14px 26px;margin:0 8px 8px 0">${escapeHtml(label)}</a>`;

/** The shared frame: dark brand band, white card, quiet footer. */
function shell(options: {
  preheader: string;
  eyebrow: string;
  body: string;
  footerNote: string;
}) {
  const base = siteUrl.replace(/\/$/, "");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<title>${escapeHtml(SITE_NAME)}</title>
</head>
<body style="margin:0;padding:0;background:${PAPER};-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${escapeHtml(options.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER}">
<tr><td align="center" style="padding:32px 12px">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px">
    <tr><td style="background:${INK};padding:30px 36px" align="left">
      <img src="${base}/brand/atelier-logo-on-dark.png" width="150" alt="${escapeHtml(SITE_NAME)}" style="display:block;border:0;color:#ffffff;font-family:${SERIF};font-size:22px;height:auto">
      <p style="margin:14px 0 0;font-family:${SANS};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c9b08a">${escapeHtml(options.eyebrow)}</p>
    </td></tr>
    <tr><td style="background:#ffffff;padding:40px 36px 34px;font-family:${SANS};font-size:15px;line-height:1.7;color:${INK}">
      ${options.body}
    </td></tr>
    <tr><td style="padding:24px 36px 8px;font-family:${SANS};font-size:12px;line-height:1.7;color:${MUTED}" align="left">
      <strong style="color:${INK}">${escapeHtml(SITE_NAME)}</strong> &middot; Exclusive Poggenpohl dealer for Atlanta and Georgia<br>
      ${escapeHtml(address.building)}, ${escapeHtml(address.street)}, ${escapeHtml(address.city)}, ${escapeHtml(address.region)} ${escapeHtml(address.postalCode)}<br>
      ${link(base, base.replace(/^https?:\/\//, ""), MUTED)} &middot; ${link(`mailto:${env("GMAIL_USER")}`, env("GMAIL_USER"), MUTED)}
    </td></tr>
    <tr><td style="padding:6px 36px 24px;font-family:${SANS};font-size:11px;line-height:1.6;color:#9a958b">${options.footerNote}</td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}

/** A label / value row inside a details card. */
const detailRow = (label: string, valueHtml: string) =>
  `<tr><td style="padding:11px 16px 11px 0;width:132px;vertical-align:top;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${MUTED};border-bottom:1px solid ${LINE}">${escapeHtml(label)}</td><td style="padding:11px 0;vertical-align:top;border-bottom:1px solid ${LINE}">${valueHtml}</td></tr>`;

function hoursTable() {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="font-size:13px;line-height:1.9;color:${INK}">${hours
    .map(
      (row) =>
        `<tr><td style="padding-right:24px;color:${MUTED}">${escapeHtml(row.day)}</td><td>${escapeHtml(row.time)}</td></tr>`,
    )
    .join("")}</table>`;
}

function receivedAt(): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/New_York",
  }).format(new Date());
}

function teamMessage(enquiry: Enquiry, from: string) {
  const form = sourceLabels[enquiry.source] ?? enquiry.source;
  const message = enquiry.message || "";
  const when = receivedAt();
  const topic = enquiry.projectType || "Consultation";

  const text = [
    `New enquiry from ${enquiry.name}`,
    `Received ${when} (Eastern Time) via ${form}`,
    "",
    `Name:          ${enquiry.name}`,
    `Email:         ${enquiry.email || "-"}`,
    `Phone:         ${enquiry.phone || "-"}`,
    `Interested in: ${enquiry.projectType || "-"}`,
    "",
    "Message:",
    message || "(no message)",
    "",
    enquiry.email
      ? "Reply to this email to answer the visitor directly."
      : `No email address was given. Call ${enquiry.phone}.`,
  ].join("\n");

  const rows = [
    detailRow("Name", `<strong>${escapeHtml(enquiry.name)}</strong>`),
    detailRow(
      "Email",
      enquiry.email
        ? link(`mailto:${enquiry.email}`, enquiry.email)
        : `<span style="color:${MUTED}">Not provided</span>`,
    ),
    detailRow(
      "Phone",
      enquiry.phone
        ? link(`tel:${enquiry.phone.replace(/[^\d+]/g, "")}`, enquiry.phone)
        : `<span style="color:${MUTED}">Not provided</span>`,
    ),
    detailRow("Interested in", escapeHtml(enquiry.projectType || "Not specified")),
    detailRow("Form", escapeHtml(form)),
  ].join("");

  const actions = [
    enquiry.email
      ? button(
          `mailto:${enquiry.email}?subject=${encodeURIComponent(`Re: your enquiry to ${SITE_NAME}`)}`,
          `Reply to ${oneLine(enquiry.name).split(" ")[0]}`,
        )
      : "",
    enquiry.phone
      ? button(`tel:${enquiry.phone.replace(/[^\d+]/g, "")}`, "Call", false)
      : "",
  ].join("");

  const body = `
      <p style="margin:0 0 6px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${GOLD}">${escapeHtml(when)} ET</p>
      <h1 style="margin:0 0 24px;font-family:${SERIF};font-size:28px;line-height:1.25;font-weight:normal;color:${INK}">New enquiry from ${escapeHtml(enquiry.name)}</h1>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${INK};font-size:14px">${rows}</table>
      <p style="margin:28px 0 8px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${MUTED}">Message</p>
      <div style="background:${PAPER};border-left:3px solid ${GOLD};padding:16px 20px;font-size:14px;line-height:1.7;white-space:pre-wrap">${message ? escapeHtml(message) : `<span style="color:${MUTED}">The visitor did not leave a message.</span>`}</div>
      <p style="margin:30px 0 0">${actions}</p>`;

  return {
    from,
    to: recipients(),
    // Replying goes straight to the visitor.
    ...(enquiry.email
      ? { replyTo: { name: oneLine(enquiry.name), address: enquiry.email } }
      : {}),
    subject: oneLine(`New enquiry: ${topic} \u2014 ${enquiry.name}`),
    text,
    html: shell({
      preheader: `${enquiry.name} asked about ${topic.toLowerCase()}.`,
      eyebrow: "New enquiry",
      body,
      footerNote: enquiry.email
        ? "Reply to this email to answer the visitor directly."
        : "This visitor gave a phone number only.",
    }),
  };
}

function autoReply(enquiry: Enquiry, from: string) {
  const first = oneLine(enquiry.name).split(" ")[0] || "there";
  const topic = enquiry.projectType;
  const base = siteUrl.replace(/\/$/, "");

  const text = [
    `Dear ${first},`,
    "",
    `Thank you for contacting ${SITE_NAME}. We have received your request${topic ? ` about ${topic.toLowerCase()}` : ""} and a member of our team will reply within one business day.`,
    "",
    "WHAT HAPPENS NEXT",
    "1. We review your request and prepare for the conversation.",
    "2. We contact you to talk through your space, timeline and ideas.",
    "3. We invite you to the Poggenpohl showroom to see materials and finishes in person.",
    "",
    "VISIT THE SHOWROOM",
    `${address.building}, ${address.street}, ${address.city}, ${address.region} ${address.postalCode}`,
    ...hours.map((row) => `${row.day}: ${row.time}`),
    "",
    `For anything urgent, call ${phone}.`,
    "",
    "Warm regards,",
    `The team at ${SITE_NAME}`,
    "Spaces That Inspire",
  ].join("\n");

  const steps = [
    ["We review your request", "We read what you have shared and prepare for the conversation."],
    ["We get in touch", "A member of the team contacts you to talk through your space, timeline and ideas."],
    ["You visit the showroom", "See Poggenpohl kitchens, materials and finishes in person in Buckhead."],
  ]
    .map(
      ([title, copy], i) =>
        `<tr><td valign="top" style="width:34px;padding:0 0 16px;font-family:${SERIF};font-size:20px;color:${GOLD}">${i + 1}</td><td style="padding:0 0 16px"><strong style="font-size:14px">${escapeHtml(title)}</strong><br><span style="font-size:14px;color:${MUTED}">${escapeHtml(copy)}</span></td></tr>`,
    )
    .join("");

  const summary = [
    topic ? detailRow("Interested in", escapeHtml(topic)) : "",
    enquiry.phone ? detailRow("Phone", escapeHtml(enquiry.phone)) : "",
    detailRow("Email", escapeHtml(enquiry.email)),
  ].join("");

  const body = `
      <h1 style="margin:0 0 20px;font-family:${SERIF};font-size:30px;line-height:1.25;font-weight:normal;color:${INK}">Thank you, ${escapeHtml(first)}.</h1>
      <p style="margin:0 0 16px">We have received your request${topic ? ` about <strong>${escapeHtml(topic.toLowerCase())}</strong>` : ""}. A member of our team will reply within <strong>one business day</strong>.</p>
      <p style="margin:0 0 28px">For anything urgent, call us on ${link(phoneHref, phone)}.</p>

      <p style="margin:0 0 10px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${MUTED}">Your request</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${INK};font-size:14px;margin-bottom:34px">${summary}</table>

      <p style="margin:0 0 14px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${MUTED}">What happens next</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:18px">${steps}</table>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER};margin:10px 0 28px">
        <tr><td style="padding:24px 26px">
          <p style="margin:0 0 4px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${GOLD}">Visit the showroom</p>
          <p style="margin:0 0 14px;font-family:${SERIF};font-size:20px">${escapeHtml(address.building)} &middot; Buckhead</p>
          <p style="margin:0 0 14px;font-size:14px">${escapeHtml(address.street)}<br>${escapeHtml(address.city)}, ${escapeHtml(address.region)} ${escapeHtml(address.postalCode)}</p>
          ${hoursTable()}
        </td></tr>
      </table>

      <p style="margin:0">${button(address.mapsUrl, "Get directions")}${button(`${base}/poggenpohl`, "Explore collections", false)}</p>

      <p style="margin:32px 0 0;font-size:14px">Warm regards,<br><strong>The team at ${escapeHtml(SITE_NAME)}</strong><br><span style="font-family:${SERIF};font-style:italic;color:${GOLD}">Spaces That Inspire</span></p>`;

  return {
    from,
    to: { name: oneLine(enquiry.name), address: enquiry.email },
    subject: `We have received your enquiry \u2014 ${SITE_NAME}`,
    text,
    html: shell({
      preheader: "Thank you for getting in touch. We will reply within one business day.",
      eyebrow: "Spaces That Inspire",
      body,
      footerNote: `You are receiving this because you sent a request through ${escapeHtml(base.replace(/^https?:\/\//, ""))}. If this was not you, you can ignore this email.`,
    }),
  };
}

function transporter() {
  const port = Number(env("GMAIL_SMTP_PORT")) || 465;
  const local = Boolean(env("GMAIL_SMTP_HOST"));
  return nodemailer.createTransport({
    host: env("GMAIL_SMTP_HOST") || "smtp.gmail.com",
    port,
    // Gmail's SMTPS port. A test server on another port speaks plain SMTP.
    secure: !local && port === 465,
    ignoreTLS: local,
    auth: {
      user: env("GMAIL_USER"),
      // Google shows app passwords in groups of four; the spaces are not part of it.
      pass: env("GMAIL_APP_PASSWORD").replace(/\s+/g, ""),
    },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
}

/**
 * Sends the team notification and, when the visitor left an email address, a
 * confirmation. Resolves true only if Gmail accepted the team notification.
 */
export async function sendEnquiryEmails(enquiry: Enquiry): Promise<boolean> {
  const user = env("GMAIL_USER");
  const name = env("MAIL_FROM_NAME") || SITE_NAME;
  const from = `"${oneLine(name).replace(/"/g, "")}" <${user}>`;
  const mail = transporter();

  try {
    await mail.sendMail(teamMessage(enquiry, from));
  } catch (error) {
    console.error(
      "gmail rejected the enquiry email",
      error instanceof Error ? error.message : error,
    );
    return false;
  }

  if (enquiry.email && env("MAIL_AUTOREPLY").toLowerCase() !== "false") {
    try {
      await mail.sendMail(autoReply(enquiry, from));
    } catch (error) {
      // The team email went out; a failed confirmation is only worth a log line.
      console.error(
        "gmail auto-reply failed",
        error instanceof Error ? error.message : error,
      );
    }
  }
  return true;
}
