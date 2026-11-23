import Link from "next/link";

import { categoryHref } from "@/lib/blog";

/** "All" plus one link per category; the current one is marked. */
export default function CategoryFilters({
  categories,
  current,
}: {
  categories: { name: string }[];
  current?: string;
}) {
  return (
    <ul className="blog-filters" aria-label="Categories">
      <li>
        <Link href="/blog" aria-current={!current ? "true" : undefined} scroll={false}>
          All
        </Link>
      </li>
      {categories.map(({ name }) => (
        <li key={name}>
          <Link
            href={categoryHref(name)}
            aria-current={current === name ? "true" : undefined}
            scroll={false}
          >
            {name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
