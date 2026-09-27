import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About AI.MAGED",
  description: "AI.MAGED is a focused book library built around carefully selected titles.",
  alternates: { canonical: "https://aimaged.com/about" },
};

export default function AboutPage() {
  return (
    <main>
      <section className="py-16 bg-navy-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs uppercase tracking-widest text-electric-500 mb-3">About</p>
          <h1 className="text-4xl font-bold font-display mb-4">A library with intention.</h1>
          <p className="text-gray-300 text-lg">AI.MAGED is built to keep discovery simple: selected books, clean pages, no random uploads.</p>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg">
          <h2>Our approach</h2>
          <p>AI.MAGED is a curated library. Books are added deliberately and remain unpublished until they are explicitly approved in the private control panel.</p>
          <p>We keep the public experience focused on the book itself: title, author, subject, description, and a clear path to read or access it.</p>
          <h2>What comes next</h2>
          <p>The platform is designed so additional formats, subjects, languages, and eventually courses can be added without rebuilding the public experience from scratch.</p>
          <p><Link href="/books" className="text-electric-500 hover:underline">Browse the library →</Link></p>
        </div>
      </section>
    </main>
  );
}
