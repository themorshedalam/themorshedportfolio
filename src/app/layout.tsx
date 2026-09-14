import type { Metadata } from "next";
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Morshed Alam — Motion Graphics Designer & Video Editor in Dubai",
    template: "%s | Morshed Alam",
  },
  description:
    "Morshed Alam is a Motion Graphics Designer and Video Editor based in Dubai, working at The Entertainer. Specializing in campaign films, launch films, and seasonal narratives using After Effects, VEO3, and Runway.",
  keywords: [
    "Morshed Alam",
    "Morshed Alam Dubai",
    "themorshedalam",
    "Motion Graphics Designer Dubai",
    "Video Editor Dubai",
    "Motion Designer UAE",
    "After Effects Dubai",
    "Campaign Film Dubai",
    "MA Studio",
    "The Entertainer designer",
    "VEO3",
    "Runway AI",
    "Graphic Designer Dubai",
    "Multimedia Designer UAE",
  ],
  authors: [{ name: "Morshed Alam", url: siteUrl }],
  creator: "Morshed Alam",
  publisher: "Morshed Alam",
  alternates: {
    canonical: siteUrl,
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
    title: "Morshed Alam — Motion Graphics Designer & Video Editor in Dubai",
    description:
      "Motion Graphics Designer and Video Editor based in Dubai. Campaign films, launch films, and seasonal narratives for brands that take craft seriously.",
    url: siteUrl,
    siteName: "Morshed Alam — Motion & Design",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "Morshed Alam — Motion Graphics Designer in Dubai",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Morshed Alam — Motion Graphics Designer in Dubai",
    description:
      "Motion Graphics Designer and Video Editor based in Dubai. Campaign films, launch films, and seasonal narratives.",
    images: ["/logo.svg"],
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
              image: `${siteUrl}/logo.svg`,
              jobTitle: "Motion Graphics Designer & Video Editor",
              worksFor: {
                "@type": "Organization",
                name: "The Entertainer FZ LLC",
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
              name: "Morshed Alam — Motion & Design",
              url: siteUrl,
              author: {
                "@type": "Person",
                name: "Morshed Alam",
              },
              description:
                "Portfolio of Morshed Alam — Motion Graphics Designer and Video Editor in Dubai.",
              inLanguage: "en",
            }),
          }}
        />
      </head>
      <body
        className={`${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
