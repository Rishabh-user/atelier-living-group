/**
 * Completed Atelier Living Group projects, shown on /our-work.
 *
 * Add a project here to publish it: nothing else in the code needs to change.
 * Only list projects Atelier delivered, with permission to publish the
 * photographs. Manufacturer photography and renderings belong in
 * content/gallery.ts, not here.
 */
export type Project = {
  slug: string;
  title: string;
  location: string;
  summary: string;
  image: string;
  imageAlt: string;
  width: number;
  height: number;
  credit?: string;
};

export const projects: Project[] = [];
