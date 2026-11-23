import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
          a({ href, children: label }) {
            const external = typeof href === "string" && /^https?:\/\//i.test(href);
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
