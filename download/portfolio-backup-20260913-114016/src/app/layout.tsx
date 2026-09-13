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

export const metadata: Metadata = {
  title: "MA — Studio · Morshed A. · Motion Design, Dubai",
  description:
    "MA — Studio is the motion design and film practice of Morshed A., a motion graphics designer and video editor based in Dubai. Campaign films, launch films, and seasonal narratives for brands that take craft seriously.",
  keywords: [
    "Motion Graphics Designer",
    "Video Editor",
    "Dubai",
    "MA Studio",
    "Morshed A.",
    "Campaign Film",
    "Motion Design",
  ],
  authors: [{ name: "MA — Studio" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "MA — Studio · Morshed A.",
    description: "Motion design and film, Dubai.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
