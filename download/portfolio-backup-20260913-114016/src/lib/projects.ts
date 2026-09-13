export type Project = {
  id: string;
  index: string; // "01", "02", ...
  title: string;
  slug: string;
  year: string;
  client: string;
  role: string;
  scope: string;
  description: string;
  brief: string;
  images: {
    src: string;
    caption: string;
  }[];
  tags: string[];
  featured?: boolean;
};

export const projects: Project[] = [
  {
    id: "celebrating-25-years",
    index: "01",
    title: "Celebrating 25 Years",
    slug: "celebrating-25-years",
    year: "2025",
    client: "The Entertainer",
    role: "Motion Design, Art Direction",
    scope: "Campaign Film, Social, OOH",
    description:
      "A milestone anniversary campaign honouring twenty-five years of memories. The film weaves archival material with newly shot cinematic scenes, moving through grand interiors and quiet, intimate moments to capture the emotional weight of a quarter century.",
    brief:
      "Craft a celebratory narrative that feels timeless rather than nostalgic — balancing the grandeur of the occasion with the humanity of the people who lived it. The visual language pairs warm golden tones with soft, deliberate camera moves.",
    images: [
      {
        src: "/projects/celebrating-25-years-1.png",
        caption: "Opening sequence — the grand entrance",
      },
      {
        src: "/projects/celebrating-25-years-2.png",
        caption: "Detail studies — light, glass, and warmth",
      },
    ],
    tags: ["Campaign", "Film", "Anniversary"],
    featured: true,
  },
  {
    id: "launch-2026",
    index: "02",
    title: "Launch 2026",
    slug: "launch-2026",
    year: "2026",
    client: "Confidential Tech",
    role: "Motion Design, Direction",
    scope: "Launch Film, Stage Content",
    description:
      "A product launch film designed to be felt before it is understood. Abstract motion builds tension across a darkened stage until the reveal — a study in restraint, pace, and the power of a single held beat.",
    brief:
      "Build anticipation through a slow, controlled visual crescendo. The palette leans into deep blacks with punctuated amber and electric blue, letting the product emerge from shadow rather than announce itself.",
    images: [
      {
        src: "/projects/launch-2026-1.png",
        caption: "Stage reveal — the moment of launch",
      },
      {
        src: "/projects/launch-2026-2.png",
        caption: "Motion frame — geometric transition study",
      },
    ],
    tags: ["Launch", "Film", "Tech"],
    featured: true,
  },
  {
    id: "staycation-escapes",
    index: "03",
    title: "Staycation Escapes",
    slug: "staycation-escapes",
    year: "2025",
    client: "Hospitality Group",
    role: "Motion Design, Edit",
    scope: "Campaign, Social Cutdowns",
    description:
      "A serene campaign for the modern escape — the kind that begins the moment you close your laptop. Long, unhurried shots move across water, light, and architecture to sell a feeling rather than a destination.",
    brief:
      "Translate stillness into motion. The edit favours slow dissolves and natural light, allowing the viewer to exhale. Colour grading is warm and filmic, with a restrained palette that lets the locations breathe.",
    images: [
      {
        src: "/projects/staycation-escapes-1.png",
        caption: "Hero frame — golden hour at the pool",
      },
      {
        src: "/projects/staycation-escapes-2.png",
        caption: "Interior — suite, light, and quiet luxury",
      },
    ],
    tags: ["Hospitality", "Campaign", "Travel"],
    featured: true,
  },
  {
    id: "ramadan-2026",
    index: "04",
    title: "Ramadan 2026",
    slug: "ramadan-2026",
    year: "2026",
    client: "Regional Brand",
    role: "Art Direction, Motion",
    scope: "Seasonal Film, Idents",
    description:
      "A seasonal film that treats Ramadan with the reverence it deserves — moving from the first light of suhoor to the warmth of gathering. The piece is built on texture, tradition, and the quiet glow of lantern light.",
    brief:
      "Avoid the obvious. The visual language is intimate and ornamental, leaning on close-ups of hands, light, and pattern. Motion is slow and contemplative, mirroring the rhythm of the month itself.",
    images: [
      {
        src: "/projects/ramadan-2026-1.png",
        caption: "Still life — lantern, dates, and moonlight",
      },
      {
        src: "/projects/ramadan-2026-2.png",
        caption: "Detail — arabesque pattern and warm bokeh",
      },
    ],
    tags: ["Seasonal", "Film", "Heritage"],
  },
  {
    id: "jetour",
    index: "05",
    title: "JETOUR",
    slug: "jetour",
    year: "2025",
    client: "JETOUR Motors",
    role: "Motion Design, Edit",
    scope: "Launch Film, Social",
    description:
      "An automotive launch film built on motion and metal. Sweeping tracking shots meet macro detail studies to express precision engineering through a cinematic grammar of light, reflection, and speed.",
    brief:
      "Let the vehicle lead. The camera stays low and close, favouring reflections and sculpted surfaces. Grade is cool and cinematic, with deep contrast that flatters the bodywork and the road alike.",
    images: [
      {
        src: "/projects/jetour-1.png",
        caption: "Hero frame — the open road at golden hour",
      },
      {
        src: "/projects/jetour-2.png",
        caption: "Macro — light signature and sculpted surface",
      },
    ],
    tags: ["Automotive", "Launch", "Film"],
    featured: true,
  },
  {
    id: "one-heart",
    index: "06",
    title: "ONE Heart",
    slug: "one-heart",
    year: "2025",
    client: "ONE Foundation",
    role: "Direction, Motion, Edit",
    scope: "Campaign Film, Documentary",
    description:
      "A campaign film about people, not statistics. Hands, faces, and small gestures carry the story — a portrait of community told through the kind of details that numbers alone can never quite reach.",
    brief:
      "Lead with humanity. The edit is gentle and observational, favouring natural light and unguarded moments. Motion design is minimal — typography that breathes, transitions that respect the subject.",
    images: [
      {
        src: "/projects/one-heart-1.png",
        caption: "Hero frame — hands, hearts, and sunset",
      },
      {
        src: "/projects/one-heart-2.png",
        caption: "Detail — a single held heart, warm and low",
      },
    ],
    tags: ["Campaign", "Documentary", "Cause"],
  },
];

export const profile = {
  studio: "MA — Studio",
  name: "Morshed A.",
  tagline: "Motion design and film for brands that take craft seriously.",
  roles: ["Motion Graphics Designer", "Video Editor", "Dubai"],
  bio: [
    "I'm a Graphic & Motion Graphics Designer at ENTERTAINER FZ LLC in Dubai, creating innovative visual content across Meta Ads, EDM, CRM, In-App, Push Notifications, and Paid Media. My work blends art direction with cutting-edge tools like VEO3 and Runway to deliver impactful creative solutions.",
    "With a professional foundation in motion graphics and video editing, I specialise in blending advanced AI technologies with traditional design workflows to produce engaging visuals and animations. Always open to conversation about craft, collaboration, and the next thing worth making.",
  ],
  location: "Dubai",
  social: [
    { label: "Behance", href: "https://www.behance.net/themorshedalam" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/themorshedalam/" },
    { label: "Instagram", href: "#" },
  ],
  email: "hello@ma-studio.co",
  resumeUrl: "#",
  year: "2026",
};

// Curated quotes about design and animation
export const designQuotes = [
  { text: "Design is not just what it looks like and feels like. Design is how it works.", author: "Steve Jobs" },
  { text: "Motion design is the art of giving life to the static.", author: "Anonymous" },
  { text: "Animation is not the art of drawings that move, but the art of movements that are drawn.", author: "Norman McLaren" },
  { text: "Good design is obvious. Great design is transparent.", author: "Joe Sparano" },
  { text: "The details are not the details. They make the design.", author: "Charles Eames" },
  { text: "Motion graphics exist in the space between design and film.", author: "Anonymous" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "Design is intelligence made visible.", author: "Alina Wheeler" },
  { text: "Every great design begins with an even better story.", author: "Lorinda Mamo" },
  { text: "Animation is about creating the illusion of life. And you can't create it if you don't have one.", author: "Brad Bird" },
  { text: "The function of design is letting design function.", author: "Michael Fantastic" },
  { text: "Design is the silent ambassador of your brand.", author: "Paul Rand" },
];

export const navItems = [
  { id: "project", label: "Project" },
  { id: "personal", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

export type NavId = (typeof navItems)[number]["id"];
