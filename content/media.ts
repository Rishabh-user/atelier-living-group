/**
 * Photography and films supplied for the five collections. Files live under
 * public/products/<slug>/<slug>-pNN.jpg and public/video/films/. They were
 * re-encoded for the web (see ASSETS.md); nothing here points at an original.
 */

export type MediaPhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Film = {
  id: string;
  collection: string;
  /** Collection slug, or "poggenpohl" for brand films. */
  slug: string;
  title: string;
  src: string;
  poster: string;
  /** Running time shown on the card, e.g. "0:56". */
  length: string;
};

const photo = (slug: string, file: string, alt: string, w: number, h: number): MediaPhoto => ({
  src: `/products/${slug}/${file}`,
  alt: `Poggenpohl ${alt}`,
  width: w,
  height: h,
});

export const collectionPhotos: Record<string, MediaPhoto[]> = {
  taglio: [
    photo("taglio", "taglio-p02.jpg", "TAGLIO kitchen seen across a reflecting pool at dusk", 1920, 1080),
    photo("taglio", "taglio-p03.jpg", "TAGLIO island with faceted fronts in front of lit display shelving", 1920, 1080),
    photo("taglio", "taglio-p04.jpg", "TAGLIO faceted island in warm light beside gold curtains", 1920, 1080),
    photo("taglio", "taglio-p06.jpg", "TAGLIO faceted corner with a tray and glasses on a stone worktop", 1920, 1080),
    photo("taglio", "taglio-p09.jpg", "TAGLIO cabinetry in a warmly lit room", 1920, 1080),
  ],
  alvolo: [
    photo("alvolo", "alvolo-p02.jpg", "ALVOLO wall run with glass-fronted cabinets and under-cabinet light", 1920, 1080),
    photo("alvolo", "alvolo-p08.jpg", "ALVOLO tall dark cabinet beside a lit island", 1200, 1800),
  ],
  solitaire: [
    photo("solitaire", "solitaire-p01.jpg", "Solitaire showcase cabinets framing a kitchen island with a curved table", 1920, 1358),
    photo("solitaire", "solitaire-p02.jpg", "Solitaire glass cabinets and a curved island under ring pendants", 1920, 1358),
    photo("solitaire", "solitaire-p03.jpg", "Solitaire oak kitchen with a wine cabinet and a stone worktop", 1920, 1358),
    photo("solitaire", "solitaire-p04.jpg", "Solitaire ONE A wine cabinet with a lit lattice front", 1200, 1800),
    photo("solitaire", "solitaire-p05.jpg", "Solitaire wine wall lit behind glass", 1200, 1800),
    photo("solitaire", "solitaire-p06.jpg", "Solitaire white tall unit between two lit display niches", 1920, 1358),
    photo("solitaire", "solitaire-p07.jpg", "Solitaire kitchen with a black veined island and a tall wine cabinet", 1920, 1080),
    photo("solitaire", "solitaire-p08.jpg", "Solitaire cabinet shelves lit with ceramics", 1920, 1358),
  ],
  modo: [
    photo("modo", "modo-p01.jpg", "+MODO island with bar stools in front of a botanical glass splashback", 1920, 1280),
    photo("modo", "modo-p02.jpg", "+MODO worktop with watermelon in front of a botanical backdrop", 1920, 1358),
    photo("modo", "modo-p04.jpg", "+MODO island in a loft with steel-framed windows", 1920, 1280),
    photo("modo", "modo-p05.jpg", "+MODO long island in a studio loft with a wooden table", 1920, 1280),
    photo("modo", "modo-p06.jpg", "+MODO island with a red marble top and a lit coral base", 1920, 1282),
    photo("modo", "modo-p07.jpg", "+MODO islands in front of a green onyx wall", 1920, 1358),
    photo("modo", "modo-p09.jpg", "+MODO terrace kitchen at dusk above the city", 1920, 1384),
  ],
  segmento: [
    photo("segmento", "segmento-p01.jpg", "+SEGMENTO grey wall run with a stone worktop", 1920, 1280),
    photo("segmento", "segmento-p02.jpg", "+SEGMENTO dark green island with bar stools in a white room", 1920, 1277),
    photo("segmento", "segmento-p03.jpg", "+SEGMENTO kitchen in a concrete house with a pale island", 1920, 1281),
    photo("segmento", "segmento-p04.jpg", "+SEGMENTO kitchen in a long corridor looking over a valley", 1920, 1281),
    photo("segmento", "segmento-p05.jpg", "+SEGMENTO stone island in a courtyard hall with a brick screen", 1920, 1384),
    photo("segmento", "segmento-p07.jpg", "+SEGMENTO dark stone island on a terrace opening to a garden", 1920, 1383),
    photo("segmento", "segmento-p08.jpg", "+SEGMENTO white islands in a dark showroom", 1920, 1357),
  ],
};

const film = (
  slug: string,
  collection: string,
  title: string,
  file: string,
  length: string,
): Film => ({
  id: file,
  slug,
  collection,
  title,
  src: `/video/films/${file}.mp4`,
  poster: `/video/films/${file}.jpg`,
  length,
});

export const films: Film[] = [
  film("taglio", "TAGLIO", "TAGLIO", "taglio-film", "1:03"),
  film("modo", "+MODO", "Gravity of Light", "modo-gravity-of-light", "0:56"),
  film("segmento", "+SEGMENTO", "Pavia", "segmento-pavia", "2:18"),
  film("modo", "+MODO", "Portrait of an Icon", "modo-portrait-of-an-icon", "3:56"),
  film("modo", "+MODO", "Splendor of Elements", "modo-splendor-of-elements", "0:25"),
  film("segmento", "+SEGMENTO", "Delicious Welcome", "segmento-delicious-welcome", "1:47"),
  film("solitaire", "SOLITAIRE", "Collectors’ Delight", "solitaire-collectors-delight", "0:25"),
];

export const filmsFor = (slug: string) => films.filter((f) => f.slug === slug);
