/**
 * Gallery data. Every file is taken from poggenpohl.com (see ASSETS.md for
 * the source URL of each). `projects` are Poggenpohl reference kitchens
 * published on Poggenpohl's own reference pages: they are not Atelier Living
 * Group installations and are captioned by place only.
 */

export type GalleryItem = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  category: "collections" | "projects";
  /** Inner page for a collection photo. */
  href?: string;
};

const c = (
  slug: string,
  file: string,
  name: string,
  alt: string,
  width: number,
  height: number,
): GalleryItem => ({
  src: `/products/${slug}/${file}.jpg`,
  width,
  height,
  alt: `Poggenpohl ${name}: ${alt}`,
  caption: name,
  category: "collections",
  href: `/poggenpohl/${slug}`,
});

const collectionPhotos: GalleryItem[] = [
  c("taglio", "taglio-09", "TAGLIO", "faceted fronts in a full kitchen", 1920, 1080),
  c("alvolo", "alvolo-01", "ALVOLO", "dark wing-inspired fronts and lit display cabinets", 1920, 1080),
  c("solitaire", "solitaire-03", "Solitaire", "ONE A Wine cabinet behind glass", 1000, 1500),
  c("modo", "modo-00", "+MODO", "island in red veined stone", 1920, 1080),
  c("segmento", "segmento-00", "+SEGMENTO", "dark fluted island under a skylight", 1920, 1080),
  c("venovo", "venovo-02", "+VENOVO", "free-standing island with a warm orange tall unit", 1920, 1358),
  c("taglio", "taglio-02", "TAGLIO", "the 44 mm sculpted front", 960, 1440),
  c("alvolo", "alvolo-06", "ALVOLO", "handle strip with concealed light", 960, 1440),
  c("modo", "modo-05", "+MODO", "veined stone worktop", 1200, 1634),
  c("segmento", "segmento-07", "+SEGMENTO", "pale stone island with a curved seating recess", 1920, 1080),
  c("solitaire", "solitaire-04", "Solitaire", "ONE A Wine bottles lit on aluminium pins", 1338, 2048),
  c("taglio", "taglio-04", "TAGLIO", "retractable shelving system", 960, 1440),
];

const projectPhotos: GalleryItem[] = ([
  { src: "/gallery/leidschendam-1.jpg", width: 1200, height: 1634, alt: "Poggenpohl kitchen, Leidschendam, NL: Kitchen island with a marble worktop and bar stools", caption: "Leidschendam, NL" },
  { src: "/gallery/leidschendam-2.jpg", width: 1600, height: 1067, alt: "Poggenpohl kitchen, Leidschendam, NL: Open kitchen with walnut-veneer tall units and a stone island", caption: "Leidschendam, NL" },
  { src: "/gallery/leidschendam-3.jpg", width: 1200, height: 1634, alt: "Poggenpohl kitchen, Leidschendam, NL: Stone worktop with a black sink and brass tap", caption: "Leidschendam, NL" },
  { src: "/gallery/leidschendam-4.jpg", width: 1200, height: 1634, alt: "Poggenpohl kitchen, Leidschendam, NL: Walnut-veneer tall units seen through a glass partition", caption: "Leidschendam, NL" },
  { src: "/gallery/melbourne-1.jpg", width: 956, height: 1700, alt: "Poggenpohl kitchen, Melbourne, AUS: Green quartzite worktop edge", caption: "Melbourne, AUS" },
  { src: "/gallery/melbourne-2.jpg", width: 1600, height: 900, alt: "Poggenpohl kitchen, Melbourne, AUS: Kitchen with a green island and bar stools", caption: "Melbourne, AUS" },
  { src: "/gallery/melbourne-3.jpg", width: 956, height: 1700, alt: "Poggenpohl kitchen, Melbourne, AUS: Pantry cabinet opened to show jars and shelves", caption: "Melbourne, AUS" },
  { src: "/gallery/melbourne-4.jpg", width: 1600, height: 900, alt: "Poggenpohl kitchen, Melbourne, AUS: Long kitchen island with a stone worktop", caption: "Melbourne, AUS" },
  { src: "/gallery/munich-1.jpg", width: 1600, height: 1067, alt: "Poggenpohl kitchen, Munich, DE: Kitchen island with a timber table extension under ring pendants", caption: "Munich, DE" },
  { src: "/gallery/munich-2.jpg", width: 1600, height: 1067, alt: "Poggenpohl kitchen, Munich, DE: Dark kitchen seen through a steel-framed glass partition", caption: "Munich, DE" },
  { src: "/gallery/munich-3.jpg", width: 1600, height: 1067, alt: "Poggenpohl kitchen, Munich, DE: Dark kitchen with a central island and ring pendants", caption: "Munich, DE" },
  { src: "/gallery/munich-4.jpg", width: 1600, height: 1067, alt: "Poggenpohl kitchen, Munich, DE: Kitchen detail with a stone worktop and flowers", caption: "Munich, DE" },
  { src: "/gallery/prague-2.jpg", width: 1600, height: 900, alt: "Poggenpohl kitchen, Prague, CZ: Living room with a corner sofa and floor-to-ceiling curtains", caption: "Prague, CZ" },
  { src: "/gallery/prague-3.jpg", width: 956, height: 1700, alt: "Poggenpohl kitchen, Prague, CZ: Stone wall panel with a ceramic vase", caption: "Prague, CZ" },
  { src: "/gallery/prague-4.jpg", width: 1600, height: 900, alt: "Poggenpohl kitchen, Prague, CZ: White kitchen under a row of pendants", caption: "Prague, CZ" },
  { src: "/gallery/prague-5.jpg", width: 1600, height: 900, alt: "Poggenpohl kitchen, Prague, CZ: White kitchen with a stone splashback and sink", caption: "Prague, CZ" },
  { src: "/gallery/san-francisco-1.jpg", width: 1600, height: 891, alt: "Poggenpohl kitchen, San Francisco, US: Bright open kitchen with glass doors to a garden", caption: "San Francisco, US" },
  { src: "/gallery/warwickshire-1.jpg", width: 1200, height: 1634, alt: "Poggenpohl kitchen, Warwickshire, UK: Black marble kitchen island beside a concrete staircase", caption: "Warwickshire, UK" },
  { src: "/gallery/warwickshire-2.jpg", width: 1600, height: 900, alt: "Poggenpohl kitchen, Warwickshire, UK: Black marble worktop with a black tap in raking light", caption: "Warwickshire, UK" },
  { src: "/gallery/warwickshire-3.jpg", width: 1600, height: 900, alt: "Poggenpohl kitchen, Warwickshire, UK: Black kitchen counter with stools beneath steel-framed glazing", caption: "Warwickshire, UK" },
] as Omit<GalleryItem, "category">[]).map((item) => ({
  ...item,
  category: "projects" as const,
}));

export const galleryItems: GalleryItem[] = [...collectionPhotos, ...projectPhotos];
