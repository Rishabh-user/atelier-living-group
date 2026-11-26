/**
 * Privacy Policy copy for /privacy.
 *
 * Paste the approved wording here, one entry per heading. While `sections` is
 * empty the page shows a short holding note, is hidden from search engines and
 * is left out of the sitemap, so nothing unapproved is promoted. As soon as
 * there is at least one section, all three switch on automatically.
 *
 * `updated` is shown under the title, e.g. "Last updated: January 5, 2027".
 */
export type PrivacySection = { heading: string; paragraphs: string[] };

export const privacy: {
  title: string;
  updated?: string;
  sections: PrivacySection[];
} = {
  title: "Privacy Policy",
  updated: undefined,
  sections: [],
};

export const privacyPublished = privacy.sections.length > 0;
