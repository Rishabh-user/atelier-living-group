/**
 * The "Our Team" section on /about. One entry per person.
 *
 * Headshots: put a square-ish portrait (about 800 x 1000, JPG) in
 * public/team/ and set `photo` to its file name, for example "murat-temiz.jpg".
 * Until a photo is set, a neutral placeholder with initials is shown.
 *
 * `bio` is a list of paragraphs. Leave it empty to show only the name and title.
 */
export type TeamMember = {
  slug: string;
  name: string;
  title: string;
  photo?: string;
  bio: string[];
};

/** The group photo shown above the individual profiles. */
export const teamPhoto = {
  file: "team.jpg",
  width: 2000,
  height: 1334,
  alt: "The Atelier Living Group team standing together in the Poggenpohl showroom",
};

export const team: TeamMember[] = [
  {
    slug: "murat-temiz",
    name: "Murat Temiz",
    title: "Founder & CEO",
    photo: "murat-temiz-full.jpg",
    bio: [
      "I grew up in Istanbul, a city where you can run out for bread and come home an hour later because someone invited you in for tea. When I think about what makes a home feel right, I think about that kind of welcome.",
      "I founded Remodel Republic in Atlanta and went on to start Atelier Living Group, where I now lead Poggenpohl Atlanta. What drew me to Poggenpohl was the care in the details, right down to how a drawer feels when you open it for the hundredth time.",
      "My favorite moment is when clients start pointing to places in the drawing. They know where they’ll sit with their morning coffee, where their kids will drop their bags, and where a friend will pull up a chair. They can already picture themselves at home.",
    ],
  },
  {
    slug: "john-coulter",
    name: "John Coulter",
    title: "Studio Manager",
    photo: "john-coulter-full.jpg",
    bio: [
      "Born in Pennsylvania and raised during my formative years in Ireland, I was fortunate to experience a country rich in charm, warmth, and hospitality, where family and food are at the heart of everyday life. These early experiences inspired my passion for home construction and kitchen design.",
      "Shortly after returning to the United States in 1989, while working in Manhattan, I was introduced to Poggenpohl. I was immediately captivated by the exceptional attention to detail, uncompromising quality, and timeless craftsmanship of its cabinetry, as well as the brand’s distinguished worldwide reputation.",
      "Today, I come to work each day with genuine excitement and gratitude, honored to be entrusted with my clients’ dreams and expectations. There is nothing more rewarding than helping bring their visions to life. I especially look forward to reconnecting with clients after installation and seeing firsthand the joy and pride they experience in owning a Poggenpohl kitchen.",
      "For me, it’s about more than designing a beautiful kitchen; it’s about creating a space where family, friends, and life’s most meaningful moments come together.",
    ],
  },
  {
    slug: "felipe-monsalve",
    name: "Felipe Monsalve",
    title: "Partnerships Manager",
    photo: "felipe-monsalve-full.jpg",
    bio: [
      "I grew up in Venezuela loving fashion and cars. I still get dressed like I’m about to walk a runway. To me, style is one of the most joyful ways to show who you are.",
      "Studying Human Development deepened my curiosity about people and how they grow; I bring that curiosity to each conversation. I love hearing what excites people and how they want a space to feel special.",
      "I love when someone lights up because they feel heard and can see their idea taking shape. My satisfaction comes from helping people bring dreams to life. That’s what makes this work personal to me.",
    ],
  },
  {
    slug: "natalia-harvey",
    name: "Natalia Harvey",
    title: "Design Manager",
    photo: "natalia-harvey-full.jpg",
    bio: [
      "I was born and raised in Colombia, a place full of warmth, color, and life, where people are friendly, music is always playing, and there’s always a reason to find the good in things. Growing up surrounded by that energy gave me an appreciation for beautiful surroundings, quality, and the little details that make a space special.",
      "I’ve always loved nature and finding beauty in its colors, textures, and organic shapes. I’m constantly inspired by it and love bringing those elements into my designs.",
      "Having studied design, I’ve always enjoyed the creative process, especially getting to know clients, listening to their ideas, and helping bring their vision to life. One of the most rewarding parts of what I do is seeing everything come together and knowing the final space feels beautiful, comfortable, and truly personal to the people who will enjoy it.",
    ],
  },
];
