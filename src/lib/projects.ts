export type ProjectCarousel = {
  id: string;
  title: string;
  subtitle?: string;
  slides: {
    src: string;
    caption: string;
  }[];
};

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
  carousels?: ProjectCarousel[];
  images: {
    src: string;
    caption: string;
    behanceUrl?: string;
    grid?: boolean;
    side?: boolean;
    gridGroup?: number;
    gridCols?: number;
    groupLabel?: string;
    /** Explicit CSS Grid placement for complex layouts */
    gridCol?: number;
    gridRowStart?: number;
    gridRowSpan?: number;
  }[];
  videos?: {
    src: string;
    caption: string;
    gridCols?: number;
    gridGroup?: number;
    groupLabel?: string;
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
  {
    id: "world-cup-2026",
    index: "07",
    title: "World CUP 2026",
    slug: "world-cup-2026",
    year: "2026",
    client: "The Entertainer",
    role: "Motion Design, Animation",
    scope: "Campaign Motion, Social Media, Kinetic Visuals",
    description:
      "A dynamic motion campaign and kinetic animation series crafted for the World Cup 2026 celebration.",
    brief:
      "Energize the tournament excitement with punchy kinetic typography, vibrant team energy, and rhythm-driven motion design optimized for mobile feeds and digital stadium displays.",
    carousels: [
      {
        id: "carousel-ksa",
        title: "Carousel KSA",
        subtitle: "4-Part Kinetic Social Carousel",
        slides: [
          {
            src: "/projects/ksa-carousel-1.gif",
            caption: "KSA Match Motion — Slide 01",
          },
          {
            src: "/projects/ksa-carousel-2.gif",
            caption: "KSA Kinetic Focus — Slide 02",
          },
          {
            src: "/projects/ksa-carousel-3.gif",
            caption: "KSA Stadium Impact — Slide 03",
          },
          {
            src: "/projects/ksa-carousel-4.gif",
            caption: "KSA Championship Finale — Slide 04",
          },
        ],
      },
      {
        id: "carousel-qatar",
        title: "Carousel Qatar",
        subtitle: "4-Part Tournament Grid Carousel",
        slides: [
          {
            src: "/projects/qatar-carousel-1.gif",
            caption: "Qatar Kickoff Dynamic — Slide 01",
          },
          {
            src: "/projects/qatar-carousel-2.gif",
            caption: "Qatar Arena Motion — Slide 02",
          },
          {
            src: "/projects/qatar-carousel-3.gif",
            caption: "Qatar Match Energy — Slide 03",
          },
          {
            src: "/projects/qatar-carousel-4.gif",
            caption: "Qatar Finale Celebration — Slide 04",
          },
        ],
      },
    ],
    images: [
      // 1. CAROUSEL KSA — 4-Slide Motion Series (At Top)
      {
        src: "/projects/ksa-carousel-1.gif",
        caption: "Carousel KSA — Slide 01",
        gridGroup: 10,
        gridCols: 4,
        groupLabel: "Carousel KSA — 4-Slide Motion Series",
      },
      {
        src: "/projects/ksa-carousel-2.gif",
        caption: "Carousel KSA — Slide 02",
        gridGroup: 10,
        gridCols: 4,
      },
      {
        src: "/projects/ksa-carousel-3.gif",
        caption: "Carousel KSA — Slide 03",
        gridGroup: 10,
        gridCols: 4,
      },
      {
        src: "/projects/ksa-carousel-4.gif",
        caption: "Carousel KSA — Slide 04",
        gridGroup: 10,
        gridCols: 4,
      },

      // 2. CAROUSEL QATAR — 4-Slide Grid Series (At Top)
      {
        src: "/projects/qatar-carousel-1.gif",
        caption: "Carousel Qatar — Slide 01",
        gridGroup: 11,
        gridCols: 4,
        groupLabel: "Carousel Qatar — 4-Slide Motion Series",
      },
      {
        src: "/projects/qatar-carousel-2.gif",
        caption: "Carousel Qatar — Slide 02",
        gridGroup: 11,
        gridCols: 4,
      },
      {
        src: "/projects/qatar-carousel-3.gif",
        caption: "Carousel Qatar — Slide 03",
        gridGroup: 11,
        gridCols: 4,
      },
      {
        src: "/projects/qatar-carousel-4.gif",
        caption: "Carousel Qatar — Slide 04",
        gridGroup: 11,
        gridCols: 4,
      },

      // 3. THEN THE OTHERS GIFS — Tournament Motion Frames (Google Drive footage)
      {
        src: "/projects/slide08_image14.gif",
        caption: "Match Day Motion — Frame 01",
        gridGroup: 12,
        gridCols: 3,
        groupLabel: "Tournament Motion & Broadcast Frames",
      },
      {
        src: "/projects/slide11_image18.gif",
        caption: "Tournament Energy — Frame 02",
        gridGroup: 12,
        gridCols: 3,
      },
      {
        src: "/projects/slide14_image23.gif",
        caption: "Championship Spirit — Frame 03",
        gridGroup: 12,
        gridCols: 3,
      },
      {
        src: "/projects/slide15_image25.gif",
        caption: "Kinetic Identity — Frame 04",
        gridGroup: 13,
        gridCols: 2,
      },
      {
        src: "/projects/slide19_image32.gif",
        caption: "Stadium Atmosphere — Frame 05",
        gridGroup: 13,
        gridCols: 2,
      },
    ],
    tags: ["World Cup 2026", "Animation", "Sports", "Motion Design"],
    featured: true,
  },
  {
    id: "qatar-ooh",
    index: "08",
    title: "Qatar OOH",
    slug: "qatar-ooh",
    year: "2026",
    client: "The Entertainer",
    role: "Motion Design, 3D & OOH Art Direction",
    scope: "Large-Format Digital Billboards, Street Totems, Key Visuals",
    description:
      "High-impact Out-Of-Home (OOH) campaign and dynamic digital totem motion series deployed across premier roadside displays and urban commercial destinations in Qatar for the ENTERTAINER.",
    brief:
      "Maximize brand dominance across large-scale roadside digital screens and pedestrian totem networks in Qatar. Pair synchronized typography and bold brand colorways to communicate 'Save With The Best App' and 'Live More, Pay Less' with instantaneous visual clarity for fast-moving traffic and footfall.",
    images: [
      // Hero: Live Architectural Facade Projection (Continuous Looping GIF)
      {
        src: "/projects/qatar-ooh-billboard-1-live.gif",
        caption: "Live On-Site Architectural Facade Projection — Qatar Twin Towers (Campaign Launch Loop)",
      },

      // 1. Digital Billboard 01: Motion Graphic + Live On-Site Demo
      {
        src: "/projects/qatar-ooh-billboard-1.gif",
        caption: "Digital Billboard 01 — 'Save With The Best App' (Motion Graphic)",
        gridGroup: 1,
        gridCols: 2,
        groupLabel: "Digital Billboard 01 — Motion Graphic & Live Installation",
      },
      {
        src: "/projects/qatar-ooh-billboard-1-live.gif",
        caption: "Digital Billboard 01 — Live On-Site Installation (Qatar)",
        gridGroup: 1,
        gridCols: 2,
      },

      // 2. Digital Billboard 02: Motion Graphic + Live On-Site Demo
      {
        src: "/projects/qatar-ooh-billboard-2.gif",
        caption: "Digital Billboard 02 — 'Live More, Pay Less' (Motion Graphic)",
        gridGroup: 2,
        gridCols: 2,
        groupLabel: "Digital Billboard 02 — Motion Graphic & Live Installation",
      },
      {
        src: "/projects/qatar-ooh-billboard-2-live.jpg",
        caption: "Digital Billboard 02 — Live On-Site Installation (Qatar)",
        gridGroup: 2,
        gridCols: 2,
      },

      // 3. Urban Digital Totem Network: 3-Part Vertical Motion Series
      {
        src: "/projects/qatar-ooh-totem-1.gif",
        caption: "Urban Totem — 'Live More, Pay Less' Loop",
        gridGroup: 3,
        gridCols: 3,
        groupLabel: "Urban Digital Totem Network — 3-Part Motion Series",
      },
      {
        src: "/projects/qatar-ooh-totem-2.gif",
        caption: "Urban Totem — 'Save With The Best App' Loop",
        gridGroup: 3,
        gridCols: 3,
      },
      {
        src: "/projects/qatar-ooh-totem-3.gif",
        caption: "Urban Totem — Kinetic Typographic Loop",
        gridGroup: 3,
        gridCols: 3,
      },
    ],
    tags: ["Qatar OOH", "Motion Design", "Digital Billboard", "Animation", "Advertising"],
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
  { id: "gallery", label: "Gallery" },
  { id: "contact", label: "Contact" },
] as const;

export type NavId = (typeof navItems)[number]["id"];
