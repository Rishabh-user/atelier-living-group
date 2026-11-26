import type { Metadata } from "next";

import JsonLd from "@/components/JsonLd";
import { phone, phoneHref } from "@/content/site";
import { privacy, privacyPublished } from "@/content/privacy";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Privacy Policy",
    description:
      "How Atelier Living Group collects, uses and protects the information you share with us.",
    path: "/privacy",
  }),
  // Kept out of search results until the approved policy text is in place.
  ...(privacyPublished ? {} : { robots: { index: false, follow: true } }),
};

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy" },
        ])}
      />
      <section className="privacy section-pad">
        <div className="shell privacy-shell">
          <p className="eyebrow dark">Legal</p>
          <h1>{privacy.title}</h1>
          {privacy.updated ? <p className="privacy-updated">{privacy.updated}</p> : null}

          {privacyPublished ? (
            privacy.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))
          ) : (
            <p>
              Our full Privacy Policy is being finalised. For any question about
              how we handle your information, call us on{" "}
              <a href={phoneHref}>{phone}</a>.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
