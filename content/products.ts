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
  /** CSS object-position when the photo is cropped to a wide band. */
  position?: string;
  alt: string;
  width: number;
  height: number;
};

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  intro: string;
  /** Looping hero film plus its still frame; omitted where Poggenpohl publishes no film. */
  video?: { src: string; poster: string };
  heroImage: ProductImage;
  heroAlt: string;
  /** Headline over the intro paragraph. */
  introTitle: string;
  /** Numbers shown on the banner; empty when Poggenpohl publishes none. */
  specs: { value: string; label: string }[];
  /** Three short ideas in the dark band under the hero. */
  pillars: { word: string; line: string }[];
  /** Closing line under the gallery. */
  galleryNote: string;
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

const img = (
  slug: string,
  n: string,
  alt: string,
  width = 960,
  height = 1440,
): ProductImage => ({
  src: `/products/${slug}/${slug}-${n}.jpg`,
  alt,
  width,
  height,
});

const p = (n: string, alt: string, landscape = false) =>
  landscape ? img("taglio", n, alt, 1920, 1080) : img("taglio", n, alt);

const a = (n: string, alt: string, w = 960, h = 1440) =>
  img("alvolo", n, alt, w, h);

const L = [1920, 1080] as const; // landscape
const P = [1200, 1634] as const; // portrait

const mo = (
  n: string,
  alt: string,
  size: readonly [number, number] = P,
): ProductImage => img("modo", n, alt, size[0], size[1]);

const sg = (
  n: string,
  alt: string,
  size: readonly [number, number] = P,
): ProductImage => img("segmento", n, alt, size[0], size[1]);

const so = (
  n: string,
  alt: string,
  w = 1000,
  h = 1500,
  position?: string,
): ProductImage => ({ ...img("solitaire", n, alt, w, h), position });

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
    heroImage: {
      src: "/products/taglio/taglio-poster.jpg",
      alt: "Poggenpohl TAGLIO kitchen with sculpted faceted fronts",
      width: 1920,
      height: 1080,
    },
    heroAlt: "Poggenpohl TAGLIO kitchen with sculpted faceted fronts",
    introTitle: "One idea, expressed in the depth of the front.",
    pillars: [
      {
        word: "Light",
        line: "Strips set flush beneath the shelves warm every object they touch.",
      },
      {
        word: "Shadow",
        line: "Four slanted facets turn the day's light into changing depth.",
      },
      {
        word: "Depth",
        line: "A 44 mm front, more than twice the usual, gives the kitchen presence.",
      },
    ],
    galleryNote:
      "Light strips set flush beneath the shelves showcase objects and create a warm, inviting atmosphere, and the interplay of light and shadow gives every surface a noticeable depth and movement.",
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
  {
    slug: "alvolo",
    name: "ALVOLO",
    tagline: "Wing-inspired fronts, lit from within.",
    intro:
      "ALVOLO is more than a concept. Made with exceptional strength and precision craftsmanship, its front makes a statement. Inspired by the graceful language of inclined wing surfaces, it deliberately breaks away from rigid, cubic structures, and its graphic design sets light and shadow playing across a sculptural kitchen.",
    heroImage: a(
      "01",
      "Poggenpohl ALVOLO kitchen with dark wing-inspired fronts and lit display cabinets",
      1920,
      1080,
    ),
    heroAlt:
      "Poggenpohl ALVOLO kitchen with dark wing-inspired fronts and lit display cabinets",
    introTitle: "Inspired by the wing, built to make a statement.",
    specs: [],
    pillars: [
      {
        word: "Wing",
        line: "Inclined surfaces break away from rigid, cubic structures.",
      },
      {
        word: "Light",
        line: "A source hidden in the handle strip glides a soft glow across the front.",
      },
      {
        word: "Steel",
        line: "Worktop and sink merge seamlessly in stainless steel.",
      },
    ],
    features: [
      {
        eyebrow: "Form",
        title: "A front with a sculptural line.",
        copy: "The deliberate use of the front creates a balanced design that is both powerful and emotionally appealing, and its inclined planes catch the light differently from every angle.",
        image: a(
          "09",
          "Poggenpohl ALVOLO full-height kitchen with inclined dark fronts",
          2000,
          2463,
        ),
      },
      {
        eyebrow: "Light",
        title: "A glow without glare.",
        copy: "A light source is concealed in the handle strip. It emits a soft glow that glides across the front without glare, keeping the design clear and minimalist while the light subtly emphasises material and form.",
        image: a("06", "Poggenpohl ALVOLO handle strip with concealed light"),
      },
      {
        eyebrow: "Storage",
        title: "Utensils at the touch of a button.",
        copy: "An innovative storage system lowers completely into the kitchen island and appears at the touch of a button, making every utensil easy to reach. It can be equipped and organised to your own needs.",
        image: a("05", "Poggenpohl ALVOLO island with lowered storage system"),
      },
      {
        eyebrow: "Material",
        title: "Perfect harmony in stainless steel.",
        copy: "The worktop and sink merge seamlessly into one piece, for an elegant, unbroken overall look.",
        image: a("08", "Poggenpohl ALVOLO stainless steel worktop and sink"),
      },
    ],
    panorama: {
      eyebrow: "Showcase",
      title: "Treasures, lit from within.",
      copy: "Light and transparent, the display cabinets from the Showcase range offer storage for exquisite treasures. Hinges sit invisibly recessed into the side of the cabinet: technology that takes a back seat and puts the design in the foreground.",
      image: a(
        "11",
        "Poggenpohl ALVOLO island with lit shelving and handle-lit fronts",
        1920,
        1080,
      ),
    },
    gallery: [
      a("03", "Poggenpohl ALVOLO Showcase display cabinet with glass shelves"),
      a("10", "Poggenpohl ALVOLO tall Showcase cabinets beside dark fronts"),
    ],
    galleryNote:
      "Showcase display cabinets add shimmering accents, arranged in harmony with the dark fronts around them.",
    closingImage: a(
      "04",
      "Poggenpohl ALVOLO kitchen with lit wall cabinets and stainless worktop",
    ),
  },
  {
    slug: "solitaire",
    name: "Solitaire",
    tagline: "Confident characters for your home.",
    intro:
      "Like a glass treasure chest, the Showcase series gives special objects a protected place. Exquisite collections and beloved everyday things sit behind a glass door with subdued LED lighting, framed to stand out or to recede. Around it, the ONE A Wine and the Stage series complete a family of pieces with real character.",
    heroImage: so(
      "01",
      "Poggenpohl Solitaire Showcase cabinet in walnut with lit glass shelves",
      1000,
      1500,
      "50% 38%",
    ),
    heroAlt:
      "Poggenpohl Solitaire Showcase cabinet in walnut with lit glass shelves",
    introTitle: "Space for beloved objects.",
    specs: [
      { value: "68", label: "Bottles as standard in the ONE A Wine" },
      { value: "25 mm", label: "Delicate door frames" },
      { value: "3", label: "Series: Showcase, ONE A Wine, Stage" },
    ],
    pillars: [
      {
        word: "Showcase",
        line: "A glass treasure chest with subdued LED light for beloved objects.",
      },
      {
        word: "Wine",
        line: "ONE A Wine holds 68 bottles and grows in a balanced architectural grid.",
      },
      {
        word: "Stage",
        line: "Pocket doors glide inside and reveal the interior only when opened.",
      },
    ],
    features: [
      {
        eyebrow: "Showcase",
        title: "Seen, or only suggested.",
        copy: "Frames with flush integrated handles underscore the vivid nature of the display, or take a more subdued role. Depending on the glass you choose, exhibits are completely hidden or silhouetted against the reflective back wall. The cabinets come in various heights.",
        image: so("02", "Poggenpohl Solitaire display niche with a sculptural vase and walnut drawer"),
      },
      {
        eyebrow: "Stage",
        title: "A steadfast free spirit.",
        copy: "The Stage series feels at home in many configurations: integrated in a cabinet system or as a stand-alone piece in the living room. Its strengths are hidden within, where pocket doors glide gently inside to reveal a richly varied interior.",
        image: so("05", "Poggenpohl Solitaire Stage bar niche with glassware and wine cooler", 1000, 1531),
      },
    ],
    panorama: {
      eyebrow: "ONE A Wine",
      title: "Precision-engineered for collectors.",
      copy: "The ONE A Wine stores up to 68 bottles as standard and expands both vertically and horizontally, always keeping a perfectly balanced grid. At its core are custom-milled aluminium pins, each with a micro-diode that lights the label without glare, and discreet O-rings that hold every bottle in silence and stability.",
      image: so(
        "04",
        "Poggenpohl ONE A Wine bottles lit on milled aluminium pins",
        1338,
        2048,
        "50% 45%",
      ),
    },
    gallery: [
      so("03", "Poggenpohl Solitaire ONE A Wine cabinet behind glass"),
      so("06", "Poggenpohl Solitaire Stage cabinets with closed pocket doors", 1000, 1531),
    ],
    galleryNote:
      "Built seamlessly into the Showcase cabinets, the ONE A Wine pairs delicate 25 mm door frames with glass from clear to bronze, anthracite or deep black, and indirect lighting that makes wine storage a design statement.",
    closingImage: so(
      "01",
      "Poggenpohl Solitaire Showcase cabinet in walnut",
    ),
  },
  {
    slug: "modo",
    name: "+MODO",
    tagline: "A culinary workbench and a stage for kitchen living.",
    intro:
      "Worktop, cabinets below and open shelves play together, and +MODO holds every possibility in store for the person who uses it. It is a culinary workbench and a stage for kitchen living, composed from exceptional materials.",
    heroImage: mo(
      "00",
      "Poggenpohl +MODO island in red veined stone with a hob and smoking pan",
      L,
    ),
    heroAlt:
      "Poggenpohl +MODO island in red veined stone with a hob and smoking pan",
    introTitle: "A workbench for cooking, a stage for living.",
    specs: [],
    pillars: [
      {
        word: "Surface",
        line: "Golden veins run across hard-wearing Persian quartzite.",
      },
      {
        word: "Shelf",
        line: "Pull-out shelving doubles as an open presentation area.",
      },
      {
        word: "Variety",
        line: "An almost endless range of materials, surfaces and colours.",
      },
    ],
    features: [
      {
        eyebrow: "Surface",
        title: "Veins of gold in stone.",
        copy: "Veins of golden colour meander across the surface of the Persian quartzite, which is especially hard-wearing thanks to its high quartz content.",
        image: mo("05", "Poggenpohl +MODO worktop in veined dark stone with pistachios"),
      },
      {
        eyebrow: "Wood",
        title: "Warm veneer, tall and calm.",
        copy: "Tall cabinets in eucalyptus veneer make an elegant complement to the kitchen island.",
        image: mo("06", "Poggenpohl +MODO tall eucalyptus veneer cabinets with a built-in oven"),
      },
      {
        eyebrow: "Display",
        title: "Shelving that serves the table.",
        copy: "+MODO's pull-out shelving is an open presentation area for food, cooking utensils and personal accessories.",
        image: mo("08", "Poggenpohl +MODO pull-out wooden shelf holding fresh herbs"),
      },
      {
        eyebrow: "Accessories",
        title: "Exceptional materials, made into objects.",
        copy: "Extraordinary materials from the +MODO collection are also made into exclusive accessories.",
        image: mo("03", "Poggenpohl +MODO accessories cut from veined marble"),
      },
    ],
    panorama: {
      eyebrow: "Space",
      title: "Opulence, in any size of room.",
      copy: "In breath-taking opulence, +MODO plays with exclusive generosity in open spaces, and the design concept is just as impressive in a kitchen of any size.",
      image: mo(
        "07",
        "Poggenpohl +MODO island with a stone worktop in front of a green onyx wall",
        L,
      ),
    },
    gallery: [
      mo("09", "Poggenpohl +MODO cabinet with a handleless front and fresh cherries", L),
      mo("10", "Poggenpohl +MODO island with pull-out drawers and lit compartments"),
    ],
    galleryNote:
      "An almost endless array of material options, surfaces and colours invite you to design your own individual kitchen and the space around it.",
    closingImage: mo(
      "04",
      "Poggenpohl +MODO island in front of a green onyx wall",
      L,
    ),
  },
  {
    slug: "segmento",
    name: "+SEGMENTO",
    tagline: "Calm objectivity, meaningful details.",
    intro:
      "In the timeless interplay between calm objectivity and meaningful details, +SEGMENTO leaves plenty of freedom to give the space your own personality. A clear design language and high-quality materials underscore its lasting effect.",
    heroImage: sg(
      "00",
      "Poggenpohl +SEGMENTO kitchen with a dark fluted island under a skylight",
      L,
    ),
    heroAlt:
      "Poggenpohl +SEGMENTO kitchen with a dark fluted island under a skylight",
    introTitle: "Quiet lines, built to last.",
    specs: [],
    pillars: [
      {
        word: "Clarity",
        line: "A clear design language, underscored by high-quality materials.",
      },
      {
        word: "Lightness",
        line: "A thin worktop emphasises the elegance of every line.",
      },
      {
        word: "Calm",
        line: "Handleless cabinets reduce the look to still surfaces and fine lines.",
      },
    ],
    features: [
      {
        eyebrow: "Worktop",
        title: "Thin, and all the lighter for it.",
        copy: "The thin worktop of +SEGMENTO emphasises the lightness of the design and the elegance of its lines.",
        image: sg("01", "Poggenpohl +SEGMENTO white island with a thin worktop", [1024, 1280]),
      },
      {
        eyebrow: "Fronts",
        title: "Handleless, reduced to surface.",
        copy: "The +SEGMENTO cabinets are handleless. The appearance is reduced to calm surfaces and fine lines.",
        image: sg("06", "Poggenpohl +SEGMENTO handleless green fronts with cookware"),
      },
      {
        eyebrow: "Stone",
        title: "Framed in natural stone.",
        copy: "On the back of the island, natural stone frames the drawers, which sit flush with the surface.",
        image: sg("08", "Poggenpohl +SEGMENTO stone worktop with an integrated sink"),
      },
    ],
    panorama: {
      eyebrow: "Detail",
      title: "A hundred stripes, one gentle curve.",
      copy: "One hundred lightly chamfered stripes form the recessed seating area, nestled within a gentle curve.",
      image: sg(
        "07",
        "Poggenpohl +SEGMENTO island in pale stone with a curved, fluted seating recess",
        L,
      ),
    },
    gallery: [
      sg("02", "Poggenpohl +SEGMENTO dark kitchen with a black sink and a green lamp", [1000, 1499]),
      sg("10", "Poggenpohl +SEGMENTO walnut drawers with fitted compartments"),
    ],
    galleryNote:
      "An almost endless array of material options, surfaces and colours invite you to design your own individual kitchen and the space around it.",
    closingImage: sg(
      "09",
      "Poggenpohl +SEGMENTO walnut-fronted island with a pale stone worktop",
      L,
    ),
  },
];

export const getProduct = (slug: string) =>
  products.find((product) => product.slug === slug);
