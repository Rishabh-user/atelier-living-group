/**
 * Single source of content for the homepage and every inner page.
 * Keeping it here means a copy change lands in one file rather than five.
 */

/**
 * Canonical origin, used for metadata, Open Graph and JSON-LD.
 * Set NEXT_PUBLIC_SITE_URL when the real domain is live; the placeholder
 * below is the ChatGPT Sites preview host.
 * NOTE: public/robots.txt and public/sitemap.xml are static files and carry
 * the same origin literally - update those two by hand at the same time.
 */
const FALLBACK_SITE_URL =
  "https://atelier-living-group.murat-temiz.chatgpt.site";

/**
 * Guarded because this module is imported by SiteNav, a client component, so
 * it is evaluated in the browser too. A bare `process.env` read here throws
 * "process is not defined" there, which breaks every next/link navigation.
 */
export const siteUrl =
  (typeof process !== "undefined"
    ? process.env?.NEXT_PUBLIC_SITE_URL
    : undefined) ?? FALLBACK_SITE_URL;
export const phone = "678-637-3262";
export const phoneHref = "tel:+16786373262";

export const address = {
  building: "Terminus",
  street: "3280 Peachtree Rd NE, Suite 125",
  city: "Atlanta",
  region: "GA",
  postalCode: "30305",
  full: "3280 Peachtree Rd NE, Suite 125, Atlanta, GA 30305",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=3280+Peachtree+Rd+NE+Suite+125+Atlanta+GA+30305",
};

export const hours = [
  { day: "Monday – Friday", time: "9:00 – 17:00" },
  { day: "Saturday", time: "By appointment" },
  { day: "Sunday", time: "Closed" },
];

export const images = {
  hero: "/images/hero.webp",
  modo: "/images/modo.jpg",
  segmento:
    "/images/segmento.jpg",
  venovo: "/images/venovo.jpg",
  material:
    "/images/material.jpg",
  experience:
    "/images/experience.jpg",
  plan: "/images/plan.jpg",
  taglio: "/images/taglio.jpg",
  alvolo: "/images/alvolo.jpg",
  oneA:
    "/images/oneA.jpg",
  segmentoDetail:
    "/images/segmentoDetail.webp",
  venovoHome:
    "/images/venovoHome.jpg",
  worktops:
    "/images/worktops.jpg",
  fronts:
    "/images/fronts.jpg",
  showroomA: "/images/showroomA.jpg",
  showroomB: "/images/showroomB.jpg",
  showroomC: "/images/showroomC.jpg",
  servicesA: "/images/servicesA.jpg",
  servicesB: "/images/servicesB.jpg",
  servicesC: "/images/servicesC.jpg",
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
    src: images.showroomA,
    alt: "Poggenpohl +SEGMENTO kitchen installed in a Munich residence",
  },
  {
    src: images.showroomB,
    alt: "Poggenpohl +SEGMENTO cabinetry and island in a Munich residence",
  },
  {
    src: images.showroomC,
    alt: "Poggenpohl cabinetry and island seen from the living space",
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
    src: images.servicesA,
    alt: "Poggenpohl surface and material samples",
  },
  {
    src: images.servicesB,
    alt: "Door samples and finish chips laid out for comparison",
  },
  {
    src: images.servicesC,
    alt: "Poggenpohl interior accessories and drawer organisation",
  },
];

/** Three-image band across the top of the contact page. */
export const contactBanner = [
  {
    src: images.alvolo,
    alt: "Poggenpohl ALVOLO kitchen with sculpted cabinetry fronts",
  },
  {
    src: images.worktops,
    alt: "Poggenpohl worktop surfaces in stone and composite",
  },
  {
    src: images.oneA,
    alt: "Poggenpohl x ONE-A kitchen architecture",
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
  { href: "/services", label: "Services" },
  { href: "/showroom", label: "Showroom" },
  { href: "/poggenpohl", label: "Poggenpohl" },
  { href: "/process", label: "Process" },
  { href: "/contact", label: "Contact" },
];

export const designWorlds = [
  {
    title: "Pure Architecture",
    image: images.hero,
    copy: "A quiet, exact language for homes where proportion, material and light do the work.",
  },
  {
    title: "Urban Residence",
    image: images.modo,
    copy: "Composed living environments for clients who want sophistication without ceremony.",
  },
  {
    title: "Material Atelier",
    image: images.material,
    copy: "Stone, wood, glass, metal and surface systems selected with architectural discipline.",
  },
  {
    title: "European Kitchen",
    image: images.segmento,
    copy: "Poggenpohl planning intelligence translated into an Atlanta and Georgia design-build experience.",
  },
];

export const journey = [
  {
    label: "Inspire",
    number: "01",
    title: "Find the architectural idea.",
    image: images.material,
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
    image: images.experience,
    copy: "Private showroom consultations reveal fully custom cabinetry, finishes, storage systems, surfaces and the detail that separates good from exceptional.",
    detail: [
      "A private session across seven Poggenpohl displays in the Terminus showroom.",
      "Door samples, finish chips and surfaces compared side by side in real light.",
      "Storage systems opened, handled and tested against how you actually cook.",
      "Appliance performance and panel integration discussed in confidence.",
    ],
  },
  {
    label: "Plan",
    number: "03",
    title: "Resolve the living environment.",
    image: images.plan,
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
    image: images.segmento,
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
    image: images.modo,
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
    image: images.plan,
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
    image: images.taglio,
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
    image: images.experience,
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
    value: "Terminus",
    label: "Buckhead showroom address",
    copy: "Visit the Poggenpohl showroom in the Terminus building at 3280 Peachtree Rd NE, Suite 125, Atlanta, GA 30305.",
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

/** Counter band on the homepage. `value` is numeric where it should animate. */
export const stats = [
  { value: 7, suffix: "", label: "Kitchen displays in Buckhead" },
  { value: 3, suffix: "", label: "Poggenpohl design concepts" },
  { value: 12, suffix: "+", label: "Georgia communities served" },
  { value: 1, suffix: "", label: "Exclusive dealer for Georgia" },
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

export const concepts = [
  {
    name: "+MODO",
    image: images.modo,
    copy: "A modular architecture of surfaces and volumes. +MODO composes the kitchen from clean horizontal planes, handleless fronts and precise reveals.",
  },
  {
    name: "+SEGMENTO",
    image: images.segmento,
    copy: "Framed segments give the kitchen a graphic order. Vertical and horizontal lines divide the elevation into considered proportions.",
  },
  {
    name: "+VENOVO",
    image: images.venovo,
    copy: "Free-standing and wall-hung elements read as furniture. +VENOVO opens the kitchen toward the living space with lightness and flexibility.",
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
      "The Poggenpohl showroom is located in the Terminus building at 3280 Peachtree Rd NE, Suite 125, Atlanta, GA 30305. Private consultations can be scheduled for homeowners, architects, designers, builders and developers.",
  },
  {
    question: "What can I see in the Terminus showroom?",
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
    image: `${siteUrl}/og.png`,
    description:
      "Exclusive Poggenpohl dealer for Atlanta and Georgia specializing in luxury kitchen design-build, premium remodeling, high-end appliances, custom cabinetry and German-made kitchen systems.",
    slogan: "Spaces That Inspire",
    telephone: "+16786373262",
    address: {
      "@type": "PostalAddress",
      streetAddress: "3280 Peachtree Rd NE Suite 125",
      addressLocality: "Atlanta",
      addressRegion: "GA",
      postalCode: "30305",
      addressCountry: "US",
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
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${siteUrl}/#faq`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  },
];
