import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import JsonLd from "@/components/JsonLd";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: '--font-space-grotesk',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aimaged.com"),
  title: {
    default: "AI.MAGED — Find the Right AI & Marketing Tools",
    template: "%s | AI.MAGED",
  },
  description:
    "Discover and compare the best AI tools, marketing platforms, and productivity software. Expert reviews, honest comparisons, and the right tool for your needs.",
  keywords: ["AI tools", "marketing tools", "software reviews", "tool comparison", "productivity"],
  applicationName: "AI.MAGED",
  alternates: {
    canonical: "https://aimaged.com",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "AI.MAGED",
    title: "AI.MAGED — Find the Right AI & Marketing Tools",
    description: "Discover and compare the best AI tools, marketing platforms, and productivity software. Expert reviews, honest comparisons, and the right tool for your needs.",
    url: "https://aimaged.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI.MAGED — Find the Right AI & Marketing Tools",
    description: "Discover and compare the best AI tools, marketing platforms, and productivity software. Expert reviews, honest comparisons, and the right tool for your needs.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans`}>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "AI.MAGED",
            url: "https://aimaged.com",
            description: "Expert reviews and comparisons of AI and marketing tools.",
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "AI.MAGED",
            url: "https://aimaged.com",
            description: "Discover and compare the best AI tools, marketing platforms, and productivity software.",
          }}
        />
        <LanguageProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
