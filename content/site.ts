/**
 * Single source of content for the homepage and every inner page.
 * Keeping it here means a copy change lands in one file rather than five.
 */

/**
 * Canonical origin, used for metadata, Open Graph, JSON-LD, robots and the
 * sitemap. Everything derives from this one value, so pointing the site at a
 * custom domain is a single change: set NEXT_PUBLIC_SITE_URL in the host
 * environment (no trailing slash) and every absolute URL follows.
 */
const FALLBACK_SITE_URL = "https://atelier-living-group.vercel.app";

/**
 * Guarded because this module is imported by SiteNav, a client component, so
 * it is evaluated in the browser too. A bare `process.env` read here throws
 * "process is not defined" there, which breaks every next/link navigation.
 */
export const siteUrl =
  (typeof process !== "undefined"
    ? process.env?.NEXT_PUBLIC_SITE_URL
    : undefined) ?? FALLBACK_SITE_URL;
export const phone = "404-912-9996";
export const phoneHref = "tel:+14049129996";

export const address = {
  building: "Terminus 100",
  street: "3280 Peachtree Rd, Unit 125",
  city: "Atlanta",
  region: "GA",
  postalCode: "30305",
  full: "3280 Peachtree Rd, Unit 125, Atlanta, GA 30305",
  // The showroom's own Google Maps listing.
  mapsUrl:
    "https://www.google.com/maps/place/Poggenpohl+Atlanta+%7C+Kitchen+Design+Studio/@33.8444362,-84.3739979,17z/data=!3m2!4b1!5s0x88f505f5c93c8b43:0x7edf0a3a151cedb5!4m6!3m5!1s0x88f505f5b1ae12bf:0x51c13cbc4525987f!8m2!3d33.8444362!4d-84.3714176!16s%2Fg%2F1tzlzt74",
  latitude: 33.8444362,
  longitude: -84.3714176,
};

export const hours = [
  { day: "Monday", time: "9:00 AM – 5:00 PM" },
  { day: "Tuesday", time: "9:00 AM – 5:00 PM" },
  { day: "Wednesday", time: "9:00 AM – 5:00 PM" },
  { day: "Thursday", time: "9:00 AM – 5:00 PM" },
  { day: "Friday", time: "9:00 AM – 5:00 PM" },
  { day: "Saturday", time: "10:00 AM – 4:00 PM" },
  { day: "Sunday", time: "Closed" },
];

/** The catalogue page: a 3D viewer plus the PDF downloads. */
export const catalogHref = "/catalogue";

export const images = {
  hero: "/images/hero.webp",
  modo: "/images/modo.jpg",
  segmento: "/images/segmento.jpg",
  venovo: "/products/venovo/venovo-01.jpg",
  material: "/images/material.jpg",
  segmentoDetail: "/images/segmentoDetail.webp",
  venovoHome: "/images/venovoHome.jpg",
  fronts: "/images/fronts.jpg",
  showroomA: "/images/showroomA.jpg",
  poggenpohlA: "/images/poggenpohlA.jpg",
  poggenpohlB: "/images/poggenpohlB.jpg",
  poggenpohlC: "/images/poggenpohlC.jpg",
};

/**
 * Banner bands. Each page gets its own three, so no image appears in two
 * banners, and none of them repeat the imagery used inside the pages.
 */
export const showroomBanner = [
  {
    src: "/showroom/banner-1.jpg",
    alt: "Poggenpohl island and stools in a loft kitchen with tall steel-framed windows",
  },
  {
    src: "/showroom/banner-2.jpg",
    alt: "A long Poggenpohl island running beside floor-to-ceiling glass",
  },
  {
    src: "/showroom/banner-3.jpg",
    alt: "A Poggenpohl kitchen in a concrete house, looking out over a valley",
  },
];

export const poggenpohlBanner = [
  {
    src: images.poggenpohlA,
    alt: "Lit Poggenpohl vitrine with glass shelves and walnut interior",
  },
  {
    src: images.poggenpohlB,
    alt: "Poggenpohl +MODO kitchen with stone island and green onyx wall",
  },
  {
    src: images.poggenpohlC,
    alt: "Poggenpohl bar cabinet with onyx back panel and wine storage",
  },
];

export const servicesBanner = [
  {
    src: "/services/banner-1.jpg",
    alt: "Poggenpohl kitchen with a long dark island seen through floor-to-ceiling glass",
  },
  {
    src: "/services/banner-2.jpg",
    alt: "Poggenpohl island in cream beneath black pendants, against a green stone wall",
  },
  {
    src: "/services/banner-3.jpg",
    alt: "Poggenpohl kitchen in grey cabinetry running along a concrete-ceilinged corridor",
  },
];

/** Three-image band across the top of the contact page. */
export const contactBanner = [
  {
    src: "/contact/banner-1.jpg",
    alt: "A woman chopping vegetables at a bright Poggenpohl kitchen island",
  },
  {
    src: "/products/segmento/segmento-07.jpg",
    alt: "Poggenpohl +SEGMENTO island in pale stone with a curved seating recess",
  },
  {
    src: "/products/taglio/taglio-09.jpg",
    alt: "Poggenpohl TAGLIO kitchen with faceted fronts",
  },
];

/**
 * Three-image band across the top of the process page. Deliberately not the
 * same three as the contact banner, and not the phase images used further
 * down the page, so nothing repeats.
 */
export const processBanner = [
  {
    src: images.fronts,
    alt: "Poggenpohl cabinetry fronts in a range of finishes",
  },
  {
    src: images.segmentoDetail,
    alt: "Poggenpohl +SEGMENTO kitchen framed in diamond grey and nero assoluto",
  },
  {
    src: images.venovoHome,
    alt: "Poggenpohl +VENOVO elements arranged as free-standing furniture",
  },
];

/** Deliverables listed beside the phases on the process page. */
export const processDeliverables = [
  "Measured drawings and elevations",
  "A complete written specification",
  "Cabinetry, finish and hardware schedules",
  "Appliance and services coordination",
  "Trade and builder communication",
  "Installation oversight and walkthrough",
];

/** Set expectations on the contact page about what happens after sending. */
export const contactSteps = [
  {
    number: "01",
    title: "We read it properly.",
    copy: "Your message goes to the person who will actually handle the project, not a shared inbox queue.",
  },
  {
    number: "02",
    title: "We reply within one business day.",
    copy: "Usually with a question or two about the residence, the architecture and your timeline.",
  },
  {
    number: "03",
    title: "We book the showroom.",
    copy: "A private, unhurried session in Buckhead with the displays and finish library set up for your project.",
  },
];

export const navLinks = [
  { href: "/services", label: "Kitchens" },
  { href: "/poggenpohl", label: "Poggenpohl" },
  { href: "/showroom", label: "Showroom" },
  { href: "/our-work", label: "Our Work" },
  { href: "/media", label: "Media" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const journey = [
  {
    label: "Inspire",
    number: "01",
    title: "Find the architectural idea.",
    image: "/journey/inspire.jpg",
    imageAlt: "A long Poggenpohl kitchen in a concrete and glass house, lit by low evening sun",
    copy: "We begin with atmosphere, rituals, light, proportion and the way a space should change daily life.",
    detail: [
      "An unhurried first conversation about the residence and how you live in it.",
      "Reference gathering: architecture, art, travel, the rooms that stayed with you.",
      "Early spatial thinking — sightlines, circulation, where light lands through the day.",
      "An honest view of budget range and programme before any drawing begins.",
    ],
  },
  {
    label: "Experience",
    number: "02",
    title: "Enter the material world.",
    image: "/journey/experience.jpg",
    imageAlt: "A Poggenpohl drawer fitted with timber inserts for knives, graters and spoons",
    copy: "Private showroom consultations reveal fully custom cabinetry, finishes, storage systems, surfaces and the detail that separates good from exceptional.",
    detail: [
      "A private session across seven Poggenpohl displays in the Terminus 100 showroom.",
      "Door samples, finish chips and surfaces compared side by side in real light.",
      "Storage systems opened, handled and tested against how you actually cook.",
      "Appliance performance and panel integration discussed in confidence.",
    ],
  },
  {
    label: "Plan",
    number: "03",
    title: "Resolve the living environment.",
    image: "/journey/plan.jpg",
    imageAlt: "A design studio where people work at a shared desk beside a lit lamp",
    copy: "Design intent becomes drawings, selections, specifications, construction coordination and a clear path toward execution.",
    detail: [
      "Measured drawings and elevations resolved to German production tolerances.",
      "A complete specification: cabinetry, finishes, hardware, surfaces, appliances.",
      "Coordination with your architect, builder and trades through the build.",
      "Installation oversight and a final walkthrough of the finished kitchen.",
    ],
  },
];

export const services = [
  "Luxury kitchen design-build",
  "Premium kitchen remodeling",
  "Fully custom kitchen cabinetry",
  "German-made Poggenpohl systems",
  "High-end appliance planning",
  "Architect and designer collaboration",
  "Whole-home living environment planning",
];

export const seoServices = [
  {
    slug: "custom-cabinetry",
    title: "Custom Cabinetry",
    heading: "Fully custom cabinetry for high-end Atlanta homes.",
    copy: "Atelier Living Group plans cabinetry around architecture, storage, appliance integration and daily use. Our work supports custom kitchen cabinets, wall systems, concealed storage, pantry planning, islands, tall units and refined material palettes for premium residences.",
    image: "/expertise/custom-cabinetry.jpg",
    imageAlt: "Poggenpohl island clad in pale veined stone, with a built-in sink",
    points: [
      "Wall systems, tall units and concealed storage planned as architecture",
      "Island proportions resolved against circulation and seating",
      "Pantry and utility planning that keeps the main space quiet",
      "Material palettes drawn from a working library of samples",
    ],
  },
  {
    slug: "german-cabinets",
    title: "German Cabinets",
    heading: "German-made Poggenpohl cabinets and kitchen systems.",
    copy: "As the exclusive Poggenpohl dealer for Atlanta and Georgia, Atelier Living Group gives homeowners, designers and builders access to German kitchen production, precision engineering, refined finishes and architectural planning standards.",
    image: "/expertise/german-cabinets.jpg",
    imageAlt: "Poggenpohl drawer fitted with timber inserts for cutlery and utensils",
    points: [
      "Exclusive Poggenpohl representation for Atlanta and Georgia",
      "+MODO, +SEGMENTO and +VENOVO design concepts",
      "German production tolerances and finish quality",
      "Specification support for architects and builders",
    ],
  },
  {
    slug: "premium-remodeling",
    title: "Premium Remodeling",
    heading: "High-end kitchen remodeling with design-build coordination.",
    copy: "For luxury kitchen remodeling, we coordinate design intent, cabinetry planning, appliance integration, materials, drawings and construction communication so the finished space feels resolved rather than assembled.",
    image: "/expertise/premium-remodeling.jpg",
    imageAlt: "Line drawing of a planned Poggenpohl kitchen elevation",
    points: [
      "Design intent held consistently from concept to installation",
      "Drawings and specifications your trades can build from",
      "Appliance, plumbing and electrical coordination handled early",
      "One point of contact through the construction programme",
    ],
  },
  {
    slug: "luxury-kitchens",
    title: "Luxury Kitchens",
    heading: "Luxury kitchens for architecture-led living.",
    copy: "Our kitchens are designed as living environments: proportion, light, material, cabinetry, storage and hospitality working together for private residences across Atlanta and Georgia.",
    image: "/expertise/luxury-kitchens.jpg",
    imageAlt: "Poggenpohl island in red veined marble with a lit terracotta tray",
    points: [
      "Kitchens composed as rooms, not as runs of cabinetry",
      "Proportion and sightlines resolved before finishes are chosen",
      "Hospitality and everyday use planned together",
      "Whole-home continuity across adjoining living spaces",
    ],
  },
  {
    slug: "high-end-appliances",
    title: "High-End Appliances",
    heading: "Premium appliance coordination for luxury kitchens.",
    copy: "Atelier Living Group plans high-end appliance packages around cooking habits, refrigeration needs, ventilation, performance, panel integration and the architectural language of the kitchen. Brand names are available in private consultation.",
    image: "/expertise/high-end-appliances.jpg",
    imageAlt: "Poggenpohl orange tall units with integrated ovens and coffee machine",
    points: [
      "Packages planned around how you actually cook and entertain",
      "Refrigeration, cooking and ventilation sized to the room",
      "Panel-ready integration so appliances read as cabinetry",
      "Partner brands discussed in private consultation",
    ],
  },
];

export const showroomHighlights = [
  {
    value: "Terminus 100",
    label: "Buckhead showroom address",
    copy: "Visit the Poggenpohl showroom in the Terminus 100 building at 3280 Peachtree Rd, Unit 125, Atlanta, GA 30305.",
  },
  {
    value: "7",
    label: "Kitchen displays",
    copy: "Seven showroom displays let clients experience Poggenpohl proportions, storage intelligence, finishes and architectural kitchen systems in person.",
  },
  {
    value: "Library",
    label: "Door samples and chips",
    copy: "A deep working library of door samples, finish chips, surfaces and material details supports precise decisions with architects, designers and builders.",
  },
];

/** Material swatch strip. Colours approximate real Poggenpohl finishes. */
export const materials = [
  { name: "Nero Assoluto", note: "Granite", color: "#23252a" },
  { name: "Diamond Grey", note: "Lacquer", color: "#8d9198" },
  { name: "Caleidoscope", note: "Veneer", color: "#6d5847" },
  { name: "Champagne", note: "Anodised", color: "#b59a72" },
  { name: "Alpine White", note: "Matt lacquer", color: "#eeece7" },
  { name: "Sage Stone", note: "Ceramic", color: "#485553" },
];

/** `href` is set once a concept has its own inner page. */
export const concepts: {
  name: string;
  href?: string;
  image: string;
  copy: string;
}[] = [
  {
    name: "+MODO",
    href: "/poggenpohl/modo",
    image: images.modo,
    copy: "A modular architecture of surfaces and volumes. +MODO composes the kitchen from clean horizontal planes, handleless fronts and precise reveals.",
  },
  {
    name: "+SEGMENTO",
    href: "/poggenpohl/segmento",
    image: images.segmento,
    copy: "Framed segments give the kitchen a graphic order. Vertical and horizontal lines divide the elevation into considered proportions.",
  },
  {
    name: "+VENOVO",
    href: "/poggenpohl/venovo",
    image: images.venovo,
    copy: "Free-standing and wall-hung elements read as furniture. +VENOVO opens the kitchen toward the living space with lightness and flexibility.",
  },
];

/** Every Poggenpohl collection with an inner page, for the homepage grid. */
export const collectionCards = [
  {
    name: "TAGLIO",
    href: "/poggenpohl/taglio",
    image: "/products/taglio/taglio-09.jpg",
    line: "Sculpted 44 mm fronts, drawn in light and shadow.",
  },
  {
    name: "ALVOLO",
    href: "/poggenpohl/alvolo",
    image: "/products/alvolo/alvolo-11.jpg",
    line: "Wing-inspired fronts with light in the handle strip.",
  },
  {
    name: "SOLITAIRE",
    href: "/poggenpohl/solitaire",
    image: "/products/solitaire/solitaire-03.jpg",
    line: "Showcase cabinets, ONE A Wine and the Stage series.",
  },
  {
    name: "+MODO",
    href: "/poggenpohl/modo",
    image: "/products/modo/modo-07.jpg",
    line: "A culinary workbench and a stage for kitchen living.",
  },
  {
    name: "+SEGMENTO",
    href: "/poggenpohl/segmento",
    image: "/products/segmento/segmento-07.jpg",
    line: "Calm objectivity and meaningful details.",
  },
  {
    name: "+VENOVO",
    href: "/poggenpohl/venovo",
    image: "/products/venovo/venovo-02.jpg",
    line: "Kitchen furniture, free to move.",
  },
];

export const serviceAreas = [
  "Atlanta",
  "Buckhead",
  "Midtown",
  "Ansley Park",
  "Sandy Springs",
  "Brookhaven",
  "Alpharetta",
  "Milton",
  "Marietta",
  "Lake Oconee",
  "North Georgia",
  "Greater Georgia",
];

/** Same twelve places as `serviceAreas`, grouped by how far from the showroom. */
export const areaGroups = [
  { label: "In town", areas: ["Atlanta", "Buckhead", "Midtown", "Ansley Park"] },
  {
    label: "North metro",
    areas: ["Sandy Springs", "Brookhaven", "Alpharetta", "Milton", "Marietta"],
  },
  {
    label: "Across Georgia",
    areas: ["Lake Oconee", "North Georgia", "Greater Georgia"],
  },
];

export const faqs = [
  {
    question: "Who is the Poggenpohl dealer for Atlanta and Georgia?",
    answer:
      "Atelier Living Group is positioned as the exclusive Poggenpohl dealer for Atlanta and Georgia, offering private consultation, showroom access, specification support and German-made kitchen systems for premium residential projects.",
  },
  {
    question: "Do you provide fully custom kitchen cabinetry?",
    answer:
      "Yes. Atelier Living Group plans fully custom kitchen cabinetry around architecture, storage, appliance integration, material selection and the way each residence is lived in.",
  },
  {
    question: "Where is the Poggenpohl showroom in Atlanta?",
    answer:
      "The Poggenpohl showroom is located in the Terminus 100 building at 3280 Peachtree Rd, Unit 125, Atlanta, GA 30305. Private consultations can be scheduled for homeowners, architects, designers, builders and developers.",
  },
  {
    question: "What can I see in the Terminus 100 showroom?",
    answer:
      "The showroom includes seven kitchen displays along with a broad library of door samples, finish chips, surfaces, cabinetry details and material references for luxury kitchen planning.",
  },
  {
    question: "What makes German cabinets different?",
    answer:
      "German cabinets are known for precise engineering, disciplined planning, durable production standards, refined finishes and highly resolved storage systems. Poggenpohl brings those qualities into an architectural kitchen system.",
  },
  {
    question: "Do you help with high-end appliance planning?",
    answer:
      "Yes. Atelier Living Group coordinates high-end appliances as part of the kitchen plan, including refrigeration, cooking, ventilation, panel-ready integration and performance requirements. Specific appliance brands are discussed privately.",
  },
  {
    question: "Do you handle high-end kitchen remodeling and design-build?",
    answer:
      "Yes. Atelier Living Group supports luxury kitchen design-build and premium remodeling with design direction, custom cabinetry planning, materials, specifications and coordination through the project path.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "Atelier Living Group serves Atlanta and the Georgia market, including Buckhead, Midtown, Ansley Park, Sandy Springs, Brookhaven, Alpharetta, Milton, Marietta, Lake Oconee and selected high-end residential projects across Georgia.",
  },
];

export const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    "@id": `${siteUrl}/#business`,
    name: "Atelier Living Group",
    url: siteUrl,
    image: [
      `${siteUrl}/og.png`,
      `${siteUrl}${images.hero}`,
      `${siteUrl}${images.showroomA}`,
      `${siteUrl}${images.segmento}`,
    ],
    description:
      "Exclusive Poggenpohl dealer for Atlanta and Georgia specializing in luxury kitchen design-build, premium remodeling, high-end appliances, custom cabinetry and German-made kitchen systems.",
    slogan: "Spaces That Inspire",
    logo: `${siteUrl}/brand/atelier-logo-on-light.png`,
    telephone: "+14049129996",
    priceRange: "$$$$",
    hasMap: address.mapsUrl,
    // Mirrors the hours published on /showroom.
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "09:00",
        closes: "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "10:00",
        closes: "16:00",
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "3280 Peachtree Rd Unit 125",
      addressLocality: "Atlanta",
      addressRegion: "GA",
      postalCode: "30305",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: address.latitude,
      longitude: address.longitude,
    },
    areaServed: serviceAreas.map((area) => ({
      "@type": "Place",
      name: area,
    })),
    brand: [
      { "@type": "Brand", name: "Atelier Living Group" },
      { "@type": "Brand", name: "Poggenpohl" },
    ],
    makesOffer: seoServices.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.heading,
        description: service.copy,
        areaServed: "Atlanta, Georgia",
      },
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "Atelier Living Group",
    description:
      "Luxury kitchen design-build, custom cabinetry, high-end appliances and Poggenpohl German cabinets in Atlanta and Georgia.",
    publisher: { "@id": `${siteUrl}/#business` },
  },
];

/** Lives on /faq, where the questions are shown. */
export const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${siteUrl}/#faq`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
