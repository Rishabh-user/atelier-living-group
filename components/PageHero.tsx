import Link from "next/link";

/**
 * Inner-page header. Deliberately lighter than the homepage hero: a single
 * tall image band with the title sitting on the page ground beneath it, so
 * inner pages read as chapters rather than competing front doors.
 */
export default function PageHero({
  eyebrow,
  title,
  intro,
  image,
  imageAlt,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  image: string;
  imageAlt: string;
}) {
  return (
    <header className="page-hero">
      <div className="page-hero-media">
        <img src={image} alt={imageAlt} fetchPriority="high" />
        <div className="page-hero-shade" />
      </div>

      <div className="page-hero-body section-pad">
        <div className="shell page-hero-grid">
          <div>
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{eyebrow}</span>
            </nav>
            <h1>{title}</h1>
          </div>
          {intro ? <p className="page-hero-intro">{intro}</p> : null}
        </div>
      </div>
    </header>
  );
}
