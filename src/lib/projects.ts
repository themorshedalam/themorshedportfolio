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
    behanceUrl?: string;
    grid?: boolean;
    side?: boolean;
    gridGroup?: number;
    gridCols?: number;
    /** Explicit CSS Grid placement for complex layouts */
    gridCol?: number;
    gridRowStart?: number;
    gridRowSpan?: number;
  }[];
  videos?: {
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
    year: "2026",
    client: "The Entertainer",
    role: "Motion Design, Storyboarding",
    scope: "Campaign Film, Social, OOH",
    description:
      "Celebrating the years of 25 for the Entertainer",
    brief:
      "Craft a celebratory narrative that feels timeless rather than nostalgic. The visual language pairs warm golden tones with kinetic type and layered motion design, built in After Effects with Illustrator and Photoshop assets.",
    images: [],
    videos: [
      {
        src: "/projects/why-love-te.mp4",
        caption: "Here Why You'll Love TE",
      },
      {
        src: "/projects/website.mp4",
        caption: "Website Header",
      },
    ],
    tags: ["Motion Graphics", "Animation", "After Effects"],
    featured: true,
  },
  {
    id: "share-the-love",
    index: "02",
    title: "Share the Love",
    slug: "share-the-love",
    year: "2026",
    client: "The Entertainer",
    role: "Motion Design, Direction",
    scope: "Launch Film, Stage Content",
    description:
      "Share the love with loved one with most affordable price",
    brief:
      "Build anticipation through a slow, controlled visual crescendo. The palette leans into deep blacks with punctuated amber and electric blue, letting the product emerge from shadow rather than announce itself.",
    images: [
      // Wide landscape — full width
      {
        src: "/projects/share-the-love-wide-1.png",
        caption: "Campaign key visual",
      },
      {
        src: "/projects/share-the-love-wide-2.png",
        caption: "Banner — extended format",
      },
      // 4:3 frames — grid
      {
        src: "/projects/share-the-love-1.png",
        caption: "Frame 01",
        grid: true,
      },
      {
        src: "/projects/share-the-love-2.png",
        caption: "Frame 02",
        grid: true,
      },
      {
        src: "/projects/share-the-love-3.png",
        caption: "Frame 03",
        grid: true,
      },
      {
        src: "/projects/share-the-love-4.png",
        caption: "Frame 04",
        grid: true,
      },
      // Portrait GIF — side column (next to the 2×2 frame grid)
      {
        src: "/projects/share-the-love-gif.gif",
        caption: "Valentine's — animated",
        grid: true,
        side: true,
      },
    ],
    tags: ["Campaign", "Animation", "Valentine's"],
    featured: true,
  },
  {
    id: "staycation-escapes",
    index: "03",
    title: "Staycation Escapes",
    slug: "staycation-escapes",
    year: "2026",
    client: "The Entertainer",
    role: "Motion Design, Edit",
    scope: "Campaign, Social Cutdowns",
    description:
      "A serene campaign for the modern escape — the kind that begins the moment you close your laptop. Long, unhurried shots move across water, light, and architecture to sell a feeling rather than a destination.",
    brief:
      "Translate stillness into motion. The edit favours slow dissolves and natural light, allowing the viewer to exhale. Colour grading is warm and filmic, with a restrained palette that lets the locations breathe.",
    images: [
      // Wide banners — full width
      { src: "/projects/staycation-wide-1.gif", caption: "Banner — campaign" },
      { src: "/projects/staycation-wide-2.gif", caption: "Banner — extended" },
      // 2-column grid — wide frames
      { src: "/projects/staycation-1.gif", caption: "Frame 01", gridGroup: 1, gridCols: 2 },
      { src: "/projects/staycation-2.gif", caption: "Frame 02", gridGroup: 1, gridCols: 2 },
      // 3-column grid — portrait frames
      { src: "/projects/staycation-3.gif", caption: "Frame 03", gridGroup: 2, gridCols: 3 },
      { src: "/projects/staycation-4.gif", caption: "Frame 04", gridGroup: 2, gridCols: 3 },
      { src: "/projects/staycation-5.gif", caption: "Frame 05", gridGroup: 2, gridCols: 3 },
      // 2-column grid — portrait stories
      { src: "/projects/staycation-story-1.gif", caption: "Story — portrait", gridGroup: 3, gridCols: 2 },
      { src: "/projects/staycation-story-2.gif", caption: "Story — portrait", gridGroup: 3, gridCols: 2 },
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
    client: "The Entertainer",
    role: "Art Direction, Motion",
    scope: "Seasonal Film, Idents",
    description:
      "A seasonal film that treats Ramadan with the reverence it deserves — moving from the first light of suhoor to the warmth of gathering. The piece is built on texture, tradition, and the quiet glow of lantern light.",
    brief:
      "Avoid the obvious. The visual language is intimate and ornamental, leaning on close-ups of hands, light, and pattern. Motion is slow and contemplative, mirroring the rhythm of the month itself.",
    images: [
      // CSS Grid: 2 cols — portrait spans 3 rows on right, wide banners + full-width between on left
      { src: "/projects/ramadan-wide-1.gif", caption: "Banner — Ramadan", gridGroup: 1, gridCol: 1, gridRowStart: 1, gridRowSpan: 1 },
      { src: "/projects/ramadan-wide-3.gif", caption: "Banner — campaign", gridGroup: 1, gridCol: 1, gridRowStart: 2, gridRowSpan: 1 },
      { src: "/projects/ramadan-wide-2.gif", caption: "Banner — extended", gridGroup: 1, gridCol: 1, gridRowStart: 3, gridRowSpan: 1 },
      { src: "/projects/ramadan-story-1.gif", caption: "Story — portrait", gridGroup: 1, gridCol: 2, gridRowStart: 1, gridRowSpan: 3 },
      // 3-column grid — wide frames
      { src: "/projects/ramadan-1.png", caption: "Frame 01", gridGroup: 2, gridCols: 3 },
      { src: "/projects/ramadan-2.png", caption: "Frame 02", gridGroup: 2, gridCols: 3 },
      { src: "/projects/ramadan-3.png", caption: "Frame 03", gridGroup: 2, gridCols: 3 },
      // 2-column grid — wide frames
      { src: "/projects/ramadan-4.png", caption: "Frame 04", gridGroup: 3, gridCols: 2 },
      { src: "/projects/ramadan-5.png", caption: "Frame 05", gridGroup: 3, gridCols: 2 },
    ],
    videos: [
      {
        src: "/projects/ramadan-greetings.mp4",
        caption: "Ramadan Greetings",
      },
    ],
    tags: ["Seasonal", "Animation", "Ramadan"],
    featured: true,
  },
  {
    id: "multiple-single-task",
    index: "05",
    title: "Multiple Single Task",
    slug: "multiple-single-task",
    year: "2026",
    client: "The Entertainer",
    role: "Motion Design, Edit",
    scope: "Campaign, Social",
    description:
      "A series of short-form motion pieces — each a single task, a single idea, executed with precision. Built for social feeds where attention is measured in seconds.",
    brief:
      "Keep it sharp. Each piece is a self-contained animation — kinetic type, shape transitions, and punchy motion design that lands in under three seconds.",
    images: [
      // 2-column grid — 9:16 portrait stories (2×2)
      { src: "/projects/mst-story-1.gif", caption: "Story 01", gridGroup: 1, gridCols: 2 },
      { src: "/projects/mst-story-2.gif", caption: "Story 02", gridGroup: 1, gridCols: 2 },
      { src: "/projects/mst-story-3.gif", caption: "Story 03", gridGroup: 1, gridCols: 2 },
      { src: "/projects/mst-story-4.gif", caption: "Story 04", gridGroup: 1, gridCols: 2 },
      // 3-column grid — near-square frames
      { src: "/projects/mst-frame-1.gif", caption: "Frame 01", gridGroup: 2, gridCols: 3 },
      { src: "/projects/mst-frame-2.gif", caption: "Frame 02", gridGroup: 2, gridCols: 3 },
      { src: "/projects/mst-frame-3.gif", caption: "Frame 03", gridGroup: 2, gridCols: 3 },
    ],
    videos: [
      {
        src: "/projects/mst-web-header.mp4",
        caption: "Web Header 2025",
      },
    ],
    tags: ["Campaign", "Animation", "Social"],
    featured: true,
  },
  {
    id: "one-heart",
    index: "06",
    title: "ONE Heart",
    slug: "one-heart",
    year: "2026",
    client: "The Entertainer",
    role: "Direction, Motion, Edit",
    scope: "Campaign Film, Documentary",
    description:
      "Share the love with loved one",
    brief:
      "Lead with humanity. The edit is gentle and observational, favouring natural light and unguarded moments. Motion design is minimal — typography that breathes, transitions that respect the subject.",
    images: [
      // 2-column grid — square frames
      { src: "/projects/one-heart-square-1.gif", caption: "Frame 01", gridGroup: 1, gridCols: 2 },
      { src: "/projects/one-heart-square-2.gif", caption: "Frame 02", gridGroup: 1, gridCols: 2 },
      // 2-column grid — portrait stories (2×2)
      { src: "/projects/one-heart-story-1.gif", caption: "Story 01", gridGroup: 2, gridCols: 2 },
      { src: "/projects/one-heart-story-2.gif", caption: "Story 02", gridGroup: 2, gridCols: 2 },
      { src: "/projects/one-heart-story-3.gif", caption: "Story 03", gridGroup: 2, gridCols: 2 },
      { src: "/projects/one-heart-story-4.gif", caption: "Story 04", gridGroup: 2, gridCols: 2 },
    ],
    tags: ["Campaign", "Animation", "Cause"],
    featured: true,
  },
];

export const profile = {
  studio: "MA — Studio",
  name: "Morshed Alam",
  tagline: "Motion design and film for brands that take craft seriously.",
  roles: ["Motion Graphics Designer", "Video Editor", "Designer"],
  bio: [
    "As a Graphic & Motion Graphics Designer at ENTERTAINER FZ LLC, I create innovative visual content. My work focuses on establishing and managing Meta Ads, EDM, CRM, In-App, Push Notifications, and Paid Media Ads to support brand development. This role allows me to use my expertise in art direction and cutting-edge tools like VEO3 and Runway to deliver impactful creative solutions.",
  ],
  location: "Dubai",
  social: [
    { label: "Behance", href: "https://www.behance.net/themorshedalam" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/themorshedalam/" },
  ],
  email: "info@themorshedalam.com",
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
