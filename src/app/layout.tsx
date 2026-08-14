import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://motionx.io"),
  title: {
    default: "MOTION.X — Find the Right AI & Marketing Tools",
    template: "%s | MOTION.X",
  },
  description:
    "Discover and compare the best AI tools, marketing platforms, and productivity software. Expert reviews, honest comparisons, and the right tool for your needs.",
  keywords: ["AI tools", "marketing tools", "software reviews", "tool comparison", "productivity"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "MOTION.X",
  },
  twitter: {
    card: "summary_large_image",
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
      <body className={inter.className}>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "MOTION.X",
            url: "https://motionx.io",
            description: "Expert reviews and comparisons of AI and marketing tools.",
            sameAs: [],
          }}
        />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
