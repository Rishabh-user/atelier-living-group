/**
 * Showroom page: one entry per project. Photos live in
 * public/showroom/projects/<slug>/ (compressed; raw originals are kept outside
 * the repo). Edit `description` to change the text above each gallery.
 * `images` are listed in display order: the first is shown largest.
 */
export type ProjectImage = { file: string; width: number; height: number };

export type ShowroomProject = {
  slug: string;
  title: string;
  place: string;
  description: string;
  /**
   * Optional credits, shown under the description. Add only what applies,
   * for example { role: "Architect", name: "Name or firm" }. Leave out to show nothing.
   */
  credits?: { role: string; name: string }[];
  /** Optional photographer credit for the project's photos. */
  photography?: string;
  images: ProjectImage[];
};

const img = (file: string, width: number, height: number): ProjectImage => ({
  file,
  width,
  height,
});

export const showroomProject: ShowroomProject = {
  slug: "showroom",
  title: "The Poggenpohl Showroom",
  place: "Terminus 100, Buckhead",
  description:
    "Our Buckhead showroom shows Poggenpohl kitchens at full scale, with working drawers, doors and a finish library you can hold up to the light.",
  images: [img("1.jpg", 1800, 1200), img("2.jpg", 1800, 1200), img("3.jpg", 800, 1200), img("4.jpg", 1800, 1200)],
};

export const showroomProjects: ShowroomProject[] = [
  {
    slug: "granny-white-pike",
    title: "Granny White Pike",
    place: "Tennessee",
    description:
      "A bright, open kitchen in clean white lacquer, with a long island, a timber-topped breakfast bar and tall storage kept flush to the wall.",
    images: [img("1.jpg", 1800, 1200), img("2.jpg", 1800, 1200), img("3.jpg", 1800, 1200)],
  },
  {
    slug: "mclendon-ave",
    title: "McLendon Avenue",
    place: "Atlanta",
    description:
      "Warm timber fronts and a stone-topped island, opening onto the living space so the kitchen reads as part of the room.",
    images: [img("1.jpg", 1800, 1200), img("3.jpg", 1800, 1266), img("2.jpg", 1419, 1800), img("4.jpg", 1216, 1800)],
  },
  {
    slug: "mt-paran-road",
    title: "Mt. Paran Road",
    place: "Atlanta",
    description:
      "White handleless cabinetry against dark hardwood, with integrated ovens and a generous island for cooking and company.",
    images: [img("2.jpg", 1800, 1200), img("3.jpg", 1800, 1200), img("4.jpg", 1200, 1800), img("1.jpg", 638, 425)],
  },
  {
    slug: "peachtree-road",
    title: "Peachtree Road",
    place: "Atlanta",
    description:
      "A calm, pale kitchen with a long breakfast counter and concealed storage, set off by dark floors and a little colour.",
    images: [img("2.jpg", 1800, 1200), img("3.jpg", 1800, 1200), img("4.jpg", 1200, 1800), img("1.jpg", 800, 532)],
  },
  {
    slug: "peachtree-road-ne",
    title: "Peachtree Road NE",
    place: "Atlanta",
    description:
      "A high-rise kitchen designed around the skyline: crisp white fronts, a sculptural hood and an island that frames the view.",
    images: [img("1.jpg", 1800, 1200), img("3.jpg", 1800, 1200), img("4.jpg", 1800, 1200), img("2.jpg", 1200, 1800)],
  },
  {
    slug: "rilman",
    title: "Rilman",
    place: "Atlanta",
    description:
      "A contemporary house built around a courtyard, with a walnut-toned kitchen, a white island and wide windows to the garden.",
    images: [img("2.jpg", 1800, 1200), img("1.jpg", 1800, 1130), img("3.jpg", 1800, 1201), img("4.jpg", 1800, 1196)],
  },
  {
    slug: "riverview-road",
    title: "Riverview Road",
    place: "Atlanta",
    description:
      "Timber and soft grey in a family kitchen, with a brass-framed island, display shelving and a quiet run of worktop.",
    images: [img("1.jpg", 1800, 1200), img("2.jpg", 1800, 1200), img("4.jpg", 1800, 1200), img("3.jpg", 800, 1200), img("5.jpg", 800, 1200)],
  },
  {
    slug: "w-andrews",
    title: "W Andrews",
    place: "Atlanta",
    description:
      "Light oak cabinetry under a timber ceiling, with a veined stone island and a kitchen that opens straight onto the living area.",
    images: [img("1.jpg", 1800, 1350), img("5.jpg", 1800, 1287), img("2.jpg", 1800, 1200), img("3.jpg", 1284, 1800), img("4.jpg", 1440, 1800)],
  },
  {
    slug: "w-conway",
    title: "W Conway",
    place: "Atlanta",
    description:
      "Dark, textured fronts balanced by a bright white island, with a bank of ovens and open shelving built into the wall.",
    images: [img("1.jpg", 1800, 1200), img("2.jpg", 1800, 1200), img("5.jpg", 1800, 1200), img("3.jpg", 1200, 1800), img("4.jpg", 1200, 1800)],
  },
];
