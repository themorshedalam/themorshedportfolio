import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Real-Time Natural Voice AI Assistant",
  description: "Natural two-way AI voice conversation with a warm male voice, real-time streaming, barge-in support, and live transcript.",
  keywords: ["AI assistant", "voice AI", "realtime", "WebRTC", "OpenAI", "Next.js"],
  authors: [{ name: "Voice Assistant Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Real-Time Natural Voice AI Assistant",
    description: "Natural two-way AI voice conversation with a warm male voice.",
    url: "https://chat.z.ai",
    siteName: "Voice Assistant",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Real-Time Natural Voice AI Assistant",
    description: "Natural two-way AI voice conversation with a warm male voice.",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
