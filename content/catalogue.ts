/**
 * Catalogues shown on /catalogue. Each PDF is also cut into page images
 * (public/catalogue/pages/<folder>/001.webp, 002.webp, ...) for the 3D viewer.
 * The Kitchen Architecture PDF stores two-page spreads, so its images are the
 * spreads split down the middle: cover, then pages 2..133, then the back cover.
 */

export type Book = {
  id: string;
  title: string;
  kicker: string;
  description: string;
  pdf: string;
  /** Rounded size of the PDF, for the download button. */
  pdfSize: string;
  folder: string;
  pages: number;
  /** Zero-based pages left out of the viewer because they are empty (no image exists). */
  skip?: number[];
  /** Pixel size of one page image. */
  width: number;
  height: number;
};

export const books: Book[] = [
  {
    id: "kitchen-architecture",
    title: "Kitchen Architecture",
    kicker: "The Poggenpohl catalogue",
    description:
      "The full Poggenpohl catalogue: the design concepts, materials, interiors and organisation systems, in 134 pages.",
    pdf: "/catalogue/poggenpohl-kitchen-architecture-catalogue.pdf",
    pdfSize: "8.2 MB",
    folder: "kitchen",
    pages: 134,
    // Pages 2 and 3 are the blank inside cover and a header-only page. They are
    // dropped as a pair so every later page keeps its left or right side.
    skip: [1, 2],
    width: 1341,
    height: 1934,
  },
  {
    id: "one-a",
    title: "ONE A × Poggenpohl",
    kicker: "Folder",
    description:
      "The ONE A folder: the Bell Collection of lighting from ONE A, shown with Poggenpohl.",
    pdf: "/catalogue/one-a-poggenpohl-folder.pdf",
    pdfSize: "4.9 MB",
    folder: "one-a",
    pages: 2,
    width: 1348,
    height: 1348,
  },
];

export const pageSrc = (book: Book, index: number) =>
  `/catalogue/pages/${book.folder}/${String(index + 1).padStart(3, "0")}.webp`;
