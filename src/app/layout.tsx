import type { Metadata } from "next";
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono, Almarai } from "next/font/google";
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

const almarai = Almarai({
  variable: "--font-almarai",
  subsets: ["arabic", "latin"],
  display: "swap",
  weight: ["300", "400", "700", "800"],
});

const siteUrl = "https://themorshedalam.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Creative Motion Graphics Designer in Dubai",
    template: "%s | Morshed Alam",
  },
  description:
    "Motion graphics designer and animator in Dubai. Motion Graphics Designer at ENTERTAINER FZ LLC, creating innovative visual content for brand growth. Specializing in Meta Ads, EDM, CRM, and Paid Media using VEO3 and Runway.",
  keywords: [
    "Morshed Alam",
    "Morshed Alam Dubai",
    "themorshedalam",
    "Motion graphics designer in Dubai",
    "Motion Graphics Designer Dubai",
    "Motion Graphics Animator in Dubai",
    "Animator in Dubai",
    "Animator Dubai",
    "Creative Motion Graphics Designer in Dubai",
    "Video Editor Dubai",
    "Motion Designer UAE",
    "After Effects Dubai",
    "Campaign Film Dubai",
    "MA Studio",
    "The Entertainer designer",
    "ENTERTAINER FZ LLC",
    "VEO3",
    "Runway AI",
    "Graphic Designer Dubai",
    "Multimedia Designer UAE",
    "Creative Multimedia Designer",
  ],
  authors: [{ name: "Morshed Alam", url: siteUrl }],
  creator: "Morshed Alam",
  publisher: "Morshed Alam",
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
    title: "Creative Motion Graphics Designer in Dubai",
    description:
      "Motion Graphics Designer at ENTERTAINER FZ LLC, creating innovative visual content for brand growth. Specializing in Meta Ads, EDM, CRM, and Paid Media using VEO3 and Runway.",
    url: siteUrl,
    siteName: "Morshed Alam — Creative Multimedia Designer",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Morshed Alam — Motion Graphics Designer in Dubai",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Creative Motion Graphics Designer in Dubai",
    description:
      "Motion Graphics Designer at ENTERTAINER FZ LLC. Specializing in Meta Ads, EDM, CRM, and Paid Media using VEO3 and Runway.",
    images: ["/og-image.png"],
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
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Morshed Alam",
              url: siteUrl,
              image: `${siteUrl}/og-image.png`,
              jobTitle: "Creative Multimedia Designer",
              worksFor: {
                "@type": "Organization",
                name: "ENTERTAINER FZ LLC",
              },
              address: {
                "@type": "PostalAddress",
                addressLocality: "Dubai",
                addressCountry: "AE",
              },
              nationality: {
                "@type": "Country",
                name: "United Arab Emirates",
              },
              knowsAbout: [
                "Motion Graphics",
                "Motion Graphics Design",
                "Motion Graphics Animation",
                "Animation",
                "Video Editing",
                "After Effects",
                "Cinema 4D",
                "VEO3",
                "Runway",
                "Campaign Films",
                "Graphic Design",
              ],
              sameAs: [
                "https://www.behance.net/themorshedalam",
                "https://www.linkedin.com/in/themorshedalam/",
                "https://themorshedalam.com",
              ],
              description:
                "Morshed Alam is a Motion Graphics Designer and Video Editor based in Dubai, working at The Entertainer FZ LLC. Specializing in campaign films, launch films, and seasonal narratives.",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Morshed Alam — Creative Multimedia Designer",
              url: siteUrl,
              author: {
                "@type": "Person",
                name: "Morshed Alam",
              },
              description:
                "Creative Motion Graphics Designer in Dubai. Motion Graphics Designer at ENTERTAINER FZ LLC, specializing in Meta Ads, EDM, CRM, and Paid Media using VEO3 and Runway.",
              inLanguage: "en",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${siteUrl}/?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "Selected Work — Morshed Alam",
              itemListOrder: "https://schema.org/ItemListOrderAscending",
              numberOfItems: projects.length,
              itemListElement: projects.map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: p.title,
                url: siteUrl,
                description: p.description,
                image: p.images[0]?.src
                  ? `${siteUrl}${p.images[0].src}`
                  : p.videos?.[0]?.src
                    ? `${siteUrl}${p.videos[0].src}`
                    : `${siteUrl}/og-image.png`,
              })),
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ImageGallery",
              name: "Morshed Alam — Motion Design Portfolio",
              url: siteUrl,
              image: projects
                .filter((p) => p.images[0]?.src)
                .slice(0, 6)
                .map((p) => ({
                  "@type": "ImageObject",
                  contentUrl: `${siteUrl}${p.images[0].src}`,
                  name: p.title,
                  description: p.description,
                  creator: {
                    "@type": "Person",
                    name: "Morshed Alam",
                  },
                })),
            }),
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap" rel="stylesheet" />
        <style>{`
          @font-face {
            font-family: 'Madani Arabic';
            src: url('https://fonts.gstatic.com/s/almarai/v15/tssoApxBaigK_hnnQ1iFo25GAA.woff2') format('woff2');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
        `}</style>
      </head>
      <body
        className={`${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} ${almarai.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
