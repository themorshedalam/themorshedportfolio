import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { projects } from "@/lib/projects";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

const siteUrl = "https://themorshedalam.com";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdfbf7" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Morshed Alam — Animator and Designer",
    template: "%s | Morshed Alam",
  },
  description:
    "Morshed Alam is a Motion Graphics Designer & Animator based in Dubai at ENTERTAINER FZ LLC. Specializing in commercial campaign films, Meta ads, 3D motion, and AI-driven creative media.",
  keywords: [
    "Morshed Alam",
    "themorshedalam",
    "Morshed Alam Dubai",
    "Motion graphics designer in Dubai",
    "Motion Graphics Designer Dubai",
    "Motion Graphics Animator in Dubai",
    "Animator in Dubai",
    "Animator Dubai",
    "Creative Motion Graphics Designer in Dubai",
    "Video Editor Dubai",
    "Motion Designer UAE",
    "After Effects Dubai",
    "Cinema 4D Dubai",
    "Campaign Film Dubai",
    "MA Studio",
    "The Entertainer designer",
    "ENTERTAINER FZ LLC",
    "VEO3",
    "Runway AI",
    "Higgsfield",
    "Meta Ads Designer",
    "Graphic Designer Dubai",
    "Multimedia Designer UAE",
    "Creative Multimedia Designer",
  ],
  authors: [{ name: "Morshed Alam", url: siteUrl }],
  creator: "Morshed Alam",
  publisher: "Morshed Alam",
  category: "design",
  classification: "Portfolio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: "Kvx0GFbbnjhTyOpBUaiOTwRSFdI8tAwEzQP0g_gIrkA",
  },
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png", sizes: "64x64" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Morshed Alam — Animator and Designer",
    description:
      "Morshed Alam is a Motion Graphics Designer & Animator based in Dubai at ENTERTAINER FZ LLC. Specializing in commercial campaign films, Meta ads, 3D motion, and AI-driven creative media.",
    url: siteUrl,
    siteName: "MA — Studio | Morshed Alam",
    type: "profile",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Morshed Alam — Animator and Designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Morshed Alam — Animator and Designer",
    description:
      "Morshed Alam is a Motion Graphics Designer & Animator based in Dubai at ENTERTAINER FZ LLC. Specializing in commercial campaign films, Meta ads, 3D motion, and AI-driven creative media.",
    images: ["/og-image.png"],
    creator: "@themorshedalam",
    site: "@themorshedalam",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const jsonLdGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": `${siteUrl}/#profile`,
      url: siteUrl,
      name: "Morshed Alam — Animator and Designer",
      isPartOf: {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
      },
      about: {
        "@id": `${siteUrl}/#person`,
      },
      mainEntity: {
        "@id": `${siteUrl}/#person`,
      },
      datePublished: "2024-01-01T00:00:00Z",
      dateModified: new Date().toISOString(),
      inLanguage: "en",
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Morshed Alam",
      alternateName: ["themorshedalam", "MA — Studio", "Morshed"],
      url: siteUrl,
      image: `${siteUrl}/projects/morshed-portrait.png`,
      jobTitle: "Motion Graphics Designer & Animator",
      worksFor: {
        "@type": "Organization",
        name: "ENTERTAINER FZ LLC",
        url: "https://www.theentertainerme.com",
        location: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Dubai",
            addressCountry: "AE",
          },
        },
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Dubai",
        addressRegion: "Dubai",
        addressCountry: "AE",
      },
      nationality: {
        "@type": "Country",
        name: "United Arab Emirates",
      },
      hasOccupation: {
        "@type": "Occupation",
        name: "Motion Graphics Designer & Video Editor",
        occupationalCategory: "27-1014.00 - Multimedia Artists and Animators",
        skills: [
          "Motion Graphics Design",
          "2D & 3D Animation",
          "Video Editing",
          "Campaign Films",
          "Meta Ads",
          "EDM & CRM Creative",
          "After Effects",
          "Cinema 4D",
          "Runway Gen-3",
          "Google VEO",
          "Higgsfield",
          "Creative Direction",
        ],
      },
      knowsAbout: [
        "Motion Graphics",
        "Motion Graphics Design",
        "Motion Graphics Animation",
        "2D Animation",
        "3D Animation",
        "Video Editing",
        "After Effects",
        "Cinema 4D",
        "Figma",
        "VEO3",
        "Runway AI",
        "Higgsfield",
        "Campaign Films",
        "Meta Ads Creative",
        "EDM Design",
      ],
      sameAs: [
        "https://www.linkedin.com/in/themorshedalam/",
        "https://www.behance.net/themorshedalam",
        "https://github.com/themorshedalam",
        "https://themorshedalam.com",
      ],
      description:
        "Morshed Alam is a Motion Graphics Designer & Animator based in Dubai, UAE, working at ENTERTAINER FZ LLC. He specializes in high-impact commercial campaign films, Meta ads, EDM, CRM, and cutting-edge generative AI animation workflows.",
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "MA — Studio | Morshed Alam",
      url: siteUrl,
      publisher: {
        "@id": `${siteUrl}/#person`,
      },
      inLanguage: "en",
      description:
        "Official motion design and animation portfolio of Morshed Alam. Discover campaign films, launch narratives, and creative motion work.",
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      name: "Frequently Asked Questions about Morshed Alam",
      mainEntity: [
        {
          "@type": "Question",
          name: "Who is Morshed Alam?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Morshed Alam is a Motion Graphics Designer, Animator, and Video Editor based in Dubai, UAE, currently designing at ENTERTAINER FZ LLC. He creates high-impact commercial films, launch campaigns, Meta Ads, and AI-augmented motion design.",
          },
        },
        {
          "@type": "Question",
          name: "What services does Morshed Alam provide?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Morshed Alam provides motion graphics design, 2D and 3D animation, commercial video editing, brand launch films, social media advertising (Meta Ads, TikTok, YouTube Shorts), EDM/CRM motion assets, and AI-driven creative workflows.",
          },
        },
        {
          "@type": "Question",
          name: "Where is Morshed Alam based and is he available for inquiries?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Morshed Alam is based in Dubai, United Arab Emirates. He can be contacted for professional collaborations and inquiries at info@themorshedalam.com or on LinkedIn at linkedin.com/in/themorshedalam.",
          },
        },
        {
          "@type": "Question",
          name: "What tools and software does Morshed Alam use?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Morshed Alam works with industry-standard post-production tools including Adobe After Effects, Adobe Premiere Pro, Cinema 4D, and Figma, alongside next-generation generative AI platforms such as Runway Gen-3, Google VEO, and Higgsfield.",
          },
        },
        {
          "@type": "Question",
          name: "What notable campaigns has Morshed Alam created?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "His portfolio highlights flagship projects including Celebrating 25 Years for The Entertainer, Staycation Escapes, Ramadan 2026, Share the Love, and the Multiple Single Task motion series.",
          },
        },
      ],
    },
    {
      "@type": "ItemList",
      "@id": `${siteUrl}/#projects`,
      name: "Selected Motion Design Work — Morshed Alam",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: projects.length,
      itemListElement: projects.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.title,
        url: `${siteUrl}/#${p.id}`,
        description: p.description,
        image: p.images[0]?.src
          ? `${siteUrl}${p.images[0].src}`
          : p.videos?.[0]?.src
            ? `${siteUrl}${p.videos[0].src}`
            : `${siteUrl}/og-image.png`,
      })),
    },
    {
      "@type": "VideoObject",
      "@id": `${siteUrl}/#showreel`,
      name: "Morshed Alam — Motion Design Showreel",
      description: "Motion design and film showreel showcasing commercial campaigns, animation, and video editing by Morshed Alam.",
      thumbnailUrl: `${siteUrl}/projects/showreel-poster.jpg`,
      contentUrl: `${siteUrl}/projects/showreel.mp4`,
      uploadDate: "2026-01-01T00:00:00Z",
      creator: {
        "@id": `${siteUrl}/#person`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdGraph),
          }}
        />
        {/* Resource hints for LCP optimization */}
        <link rel="preload" as="image" href="/projects/showreel-poster.jpg" fetchPriority="high" />
        <link rel="preload" as="image" href="/projects/showreel-banner.gif" fetchPriority="high" />
        <link rel="preconnect" href="https://api.aladhan.com" />
        <link rel="dns-prefetch" href="https://api.aladhan.com" />
        {/* Prevent flash of wrong theme (FOUC) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark");}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
