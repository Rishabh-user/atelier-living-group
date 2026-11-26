import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { siteUrl } from "@/content/site";

const OWN_HOSTS = new Set(["atelierlivinggroup.com", "www.atelierlivinggroup.com"]);
try {
  OWN_HOSTS.add(new URL(siteUrl).host);
} catch {
  /* siteUrl is always a valid URL; this only guards a bad env value */
}

/** "https://atelierlivinggroup.com/blog/x?y#z" -> "/blog/x?y#z" for our own hosts. */
function toSiteHref(href: string | undefined): string | undefined {
  if (!href || !/^https?:\/\//i.test(href)) return href;
  try {
    const url = new URL(href);
    if (OWN_HOSTS.has(url.host)) return `${url.pathname}${url.search}${url.hash}` || "/";
  } catch {
    /* leave odd links alone */
  }
  return href;
}

/**
 * Markdown for blog posts. Raw HTML in the source is shown as text, never
 * rendered, and react-markdown drops javascript: links, so a post cannot
 * inject markup or script into a page.
 */
export default function Markdown({ children }: { children: string }) {
  return (
    <div className="post-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a({ href: rawHref, title, children: label }) {
            // Links written with the site's own domain (the planned production
            // domain, or this deployment) become site-relative, so they work on
            // previews as well and open in the same tab.
            const href = toSiteHref(rawHref);
            const isExternal = typeof href === "string" && /^https?:\/\//i.test(href);
            // The editor writes [text](address "_blank") to force a new tab and
            // "_self" to keep an outside link in the same tab. Without either,
            // outside links open in a new tab and site links stay put.
            const external = title === "_blank" ? true : title === "_self" ? false : isExternal;
            return (
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {label}
              </a>
            );
          },
          img({ src, alt }) {
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={typeof src === "string" ? src : undefined} alt={alt ?? ""} loading="lazy" />
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
