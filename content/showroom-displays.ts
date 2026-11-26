/**
 * The kitchen displays in the Terminus 100 showroom, shown as a gallery on
 * /showroom. The number of entries here is the display count used across the
 * whole site (headings, FAQ answers, the showroom cards), so adding or
 * removing a line below is all it takes once the final count is confirmed.
 *
 * To fill a slot: put the photos in public/showroom/displays/<slug>/ (web size,
 * about 1800px on the long edge), then list them in `photos`. A display with
 * no photos shows a placeholder frame.
 */
export type DisplayPhoto = { file: string; width: number; height: number };

export type ShowroomDisplay = {
  slug: string;
  /** Shown under the photo, e.g. "TAGLIO" or "Display 1". */
  name: string;
  /** One short line, optional. */
  caption?: string;
  photos: DisplayPhoto[];
};

export const showroomDisplays: ShowroomDisplay[] = [
  { slug: "display-1", name: "Display 1", photos: [] },
  { slug: "display-2", name: "Display 2", photos: [] },
  { slug: "display-3", name: "Display 3", photos: [] },
  { slug: "display-4", name: "Display 4", photos: [] },
  { slug: "display-5", name: "Display 5", photos: [] },
  { slug: "display-6", name: "Display 6", photos: [] },
  { slug: "display-7", name: "Display 7", photos: [] },
];

export const displayCount = showroomDisplays.length;

const WORDS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight",
  "nine", "ten", "eleven", "twelve",
];

/** "seven", for running text. */
export const displayWord = WORDS[displayCount] ?? String(displayCount);
/** "Seven", for the start of a sentence. */
export const displayWordCap = displayWord.charAt(0).toUpperCase() + displayWord.slice(1);
