import Link from "next/link";
import type { ReactNode } from "react";

export type BannerShot = { src: string; alt: string };

/**
 * Inner-page header: a three-plate image band with an overlaid location tag,
 * then the title and intro on the page ground beneath it.
 *
 * Shared by /contact and /process so the two read as the same treatment with
 * different photography.
 */
export default function PageBanner({
  crumb,
  title,
  intro,
  tag,
  shots,
  actions,
}: {
  crumb: string;
  title: string;
  intro: string;
  tag: string;
  shots: BannerShot[];
  actions?: ReactNode;
}) {
  return (
    <header className="page-banner">
      <div className="page-banner-band">
        {shots.map((shot, i) => (
          <figure key={shot.src} data-slot={i}>
            <img
              src={shot.src}
              alt={shot.alt}
              fetchPriority={i === 0 ? "high" : undefined}
              loading={i === 0 ? undefined : "lazy"}
              decoding="async"
            />
          </figure>
        ))}
        <div className="page-banner-scrim" />
        <p className="page-banner-tag">{tag}</p>
      </div>

      <div className="page-banner-body section-pad">
        <div className="shell page-banner-grid">
          <div>
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{crumb}</span>
            </nav>
            <h1>{title}</h1>
          </div>
          <div className="page-banner-intro">
            <p>{intro}</p>
            {actions ? (
              <div className="page-banner-actions">{actions}</div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
