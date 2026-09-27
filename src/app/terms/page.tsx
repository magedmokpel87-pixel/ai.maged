import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "AI.MAGED terms of service.",
  alternates: { canonical: "https://aimaged.com/terms" },
  robots: { index: true, follow: false },
};

export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-navy-900 mb-8">Terms of Service</h1>
      <div className="prose prose-lg max-w-none text-gray-700">
        <p className="text-sm text-gray-500 mb-8">Last updated: September 2026</p>
        <h2>1. Use of the Site</h2>
        <p>You may browse AI.MAGED for lawful personal and informational purposes.</p>
        <h2>2. Book Content</h2>
        <p>Book titles, descriptions, covers, and links may be supplied by the site administrator or related publishers. Availability, rights, formats, and external destinations may change.</p>
        <h2>3. Intellectual Property</h2>
        <p>Original AI.MAGED content belongs to its respective owner. Book titles, cover art, text, trademarks, and publisher rights belong to their respective rights holders.</p>
        <h2>4. Third-Party Links</h2>
        <p>AI.MAGED is not responsible for the content, pricing, availability, or practices of third-party websites linked from the library.</p>
        <h2>5. Changes</h2>
        <p>These terms may be updated as the platform develops.</p>
        <h2>6. Contact</h2>
        <p>Questions about these terms can be raised through the Contact page.</p>
      </div>
    </main>
  );
}
