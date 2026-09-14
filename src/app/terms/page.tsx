import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "AI.MAGED terms of service. Please read these terms before using our website.",
  alternates: {
    canonical: "https://aimaged.com/terms",
  },
  robots: {
    index: true,
    follow: false,
  },
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-navy-900 mb-8">Terms of Service</h1>
      <div className="prose prose-lg max-w-none text-gray-700">
        <p className="text-sm text-gray-500 mb-8">Last updated: August 2026</p>

        <h2 className="text-xl font-bold text-navy-900 mt-8 mb-4">1. Acceptance of Terms</h2>
        <p>By accessing and using AI.MAGED, you accept and agree to be bound by these Terms of Service.</p>

        <h2 className="text-xl font-bold text-navy-900 mt-8 mb-4">2. Content & Reviews</h2>
        <p>Our reviews and comparisons are based on our research and analysis. While we strive for accuracy, we cannot guarantee that all information is current or complete. Product features, pricing, and availability may change without notice.</p>

        <h2 className="text-xl font-bold text-navy-900 mt-8 mb-4">3. Affiliate Relationships</h2>
        <p>AI.MAGED participates in affiliate programs. This means we may earn commissions when you click links and make purchases through our site. This does not affect the price you pay. See our Affiliate Disclosure for more details.</p>

        <h2 className="text-xl font-bold text-navy-900 mt-8 mb-4">4. Limitation of Liability</h2>
        <p>AI.MAGED provides information for educational purposes. We are not responsible for any decisions you make based on our content, or for any issues with third-party products or services linked from our site.</p>

        <h2 className="text-xl font-bold text-navy-900 mt-8 mb-4">5. Intellectual Property</h2>
        <p>All original content on AI.MAGED is our intellectual property. Product names, logos, and trademarks belong to their respective owners.</p>

        <h2 className="text-xl font-bold text-navy-900 mt-8 mb-4">6. Changes to Terms</h2>
        <p>We may update these terms at any time. Continued use of the site after changes constitutes acceptance of the new terms.</p>

        <h2 className="text-xl font-bold text-navy-900 mt-8 mb-4">7. Contact</h2>
        <p>For questions about these terms, contact us at legal@aimaged.com.</p>
      </div>
    </div>
  );
}
