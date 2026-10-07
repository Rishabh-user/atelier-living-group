/**
 * Poggenpohl collection pages. One entry per collection; the route at
 * /poggenpohl/[slug] renders whatever is listed here, so adding ALVOLO,
 * Solitaire, +MODO, +SEGMENTO or +VENOVO is a data change plus its assets.
 *
 * Copy is paraphrased from the Poggenpohl TAGLIO page; figures (44 mm front,
 * 12 mm frame and cover plate) are Poggenpohl's published specifications.
 * Every file referenced here is listed in ASSETS.md for brand approval.
 */

export type ProductImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  intro: string;
  /** Looping hero film plus its still frame. */
  video: { src: string; poster: string };
  heroAlt: string;
  specs: { value: string; label: string }[];
  features: {
    eyebrow: string;
    title: string;
    copy: string;
    image: ProductImage;
  }[];
  /** Full-bleed landscape moment between feature rows. */
  panorama: { eyebrow: string; title: string; copy: string; image: ProductImage };
  gallery: ProductImage[];
  closingImage: ProductImage;
};

const p = (n: string, alt: string, landscape = false): ProductImage => ({
  src: `/products/taglio/taglio-${n}.jpg`,
  alt,
  width: landscape ? 1920 : 960,
  height: landscape ? 1080 : 1440,
});

export const products: Product[] = [
  {
    slug: "taglio",
    name: "TAGLIO",
    tagline: "Sculpted fronts, drawn in light and shadow.",
    intro:
      "The TAGLIO design concept pairs an expressive yet elegant appearance with artistic, three-dimensional fronts. Light and shadow play across their facets and bring the room to life, while distinctive fronts are placed selectively so the whole kitchen stays calm, harmonious and functional.",
    video: {
      src: "/video/taglio-loop.mp4",
      poster: "/products/taglio/taglio-poster.jpg",
    },
    heroAlt: "Poggenpohl TAGLIO kitchen with sculpted faceted fronts",
    specs: [
      { value: "44 mm", label: "Front depth, over twice the usual" },
      { value: "4", label: "Slanted facets on every front" },
      { value: "12 mm", label: "Frame line and cover plate" },
    ],
    features: [
      {
        eyebrow: "Presence",
        title: "A front with real depth.",
        copy: "An impressive front depth of 44 mm, more than twice as thick as usual, gives the kitchen a sculptural presence and a sense of value you can see and feel the moment you touch it.",
        image: p("02", "Poggenpohl TAGLIO kitchen showing the 44 mm sculpted front"),
      },
      {
        eyebrow: "Storage",
        title: "Everything in reach, nothing on show.",
        copy: "A retractable shelving system enriches the open space with kitchen utensils. Closed, it is completely invisible and conceals everything that would disturb the beauty and calm of the kitchen.",
        image: p("04", "Poggenpohl TAGLIO retractable shelving system"),
      },
    ],
    panorama: {
      eyebrow: "Craft",
      title: "Four facets, like a cut diamond.",
      copy: "The characteristic look of TAGLIO comes from four slanted surfaces arranged like the facets of a diamond. Delicate chamfers emphasise the precision of the craftsmanship, and recurring 12 mm material thicknesses, where the frame line meets the cover plate, give the design its calm.",
      image: p("09", "Poggenpohl TAGLIO faceted fronts in a full kitchen", true),
    },
    gallery: [
      p("06", "Poggenpohl TAGLIO cabinetry detail"),
      p("08", "Poggenpohl TAGLIO shelves with flush-mounted light strips"),
    ],
    closingImage: p("07", "Poggenpohl TAGLIO kitchen in warm evening light"),
  },
];

export const getProduct = (slug: string) =>
  products.find((product) => product.slug === slug);
