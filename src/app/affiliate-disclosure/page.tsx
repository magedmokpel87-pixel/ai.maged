import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description: "AI.MAGED affiliate disclosure.",
  alternates: { canonical: "https://aimaged.com/affiliate-disclosure" },
  robots: { index: true, follow: false },
};

export default function AffiliateDisclosurePage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-navy-900 mb-8">Affiliate Disclosure</h1>
      <div className="prose prose-lg max-w-none text-gray-700">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
          <p className="text-blue-900 font-medium">Some links from AI.MAGED may be affiliate links. When a qualifying action occurs, AI.MAGED may receive a commission at no extra cost to you.</p>
        </div>
        <h2>How it works</h2>
        <p>Where a book page points to a retailer, publisher, or other partner, the destination may use an affiliate relationship.</p>
        <h2>Transparency</h2>
        <p>Affiliate relationships do not mean that a book is added automatically. Public titles are still selected and explicitly published by the site administrator.</p>
        <h2>Questions</h2>
        <p>For questions about a particular link, use the Contact page.</p>
      </div>
    </main>
  );
}
