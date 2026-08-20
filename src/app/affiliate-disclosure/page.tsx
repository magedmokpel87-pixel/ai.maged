import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description: "MOTION.X affiliate disclosure. Transparency about how we earn money through affiliate partnerships.",
  alternates: {
    canonical: "https://motionx.io/affiliate-disclosure",
  },
  robots: {
    index: true,
    follow: false,
  },
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-navy-900 mb-8">Affiliate Disclosure</h1>
      <div className="prose prose-lg max-w-none text-gray-700">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
          <p className="text-blue-900 font-medium">
            Transparency is important to us. This page explains how MOTION.X earns money and how it affects our content.
          </p>
        </div>

        <h2 className="text-xl font-bold text-navy-900 mt-8 mb-4">How We Make Money</h2>
        <p>MOTION.X earns revenue through affiliate partnerships. When you click a link on our site and make a purchase or sign up for a service, we may receive a commission from that company at no extra cost to you.</p>

        <h2 className="text-xl font-bold text-navy-900 mt-8 mb-4">Does This Affect Our Reviews?</h2>
        <p>No. Our editorial process is independent of our affiliate relationships. We review and recommend tools based on their merit, features, and suitability for different use cases. We include both pros and cons in every review, and we do not favor higher-commission products over better alternatives.</p>

        <h2 className="text-xl font-bold text-navy-900 mt-8 mb-4">FTC Compliance</h2>
        <p>In accordance with the Federal Trade Commission (FTC) guidelines, we disclose that:</p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>Some links on this website are affiliate links</li>
          <li>We may earn commissions from qualifying purchases</li>
          <li>This does not increase the price you pay</li>
          <li>We only recommend products we believe provide value</li>
        </ul>

        <h2 className="text-xl font-bold text-navy-900 mt-8 mb-4">Our Commitment</h2>
        <p>We are committed to providing honest, useful content that helps you make informed decisions. If a tool is not good, we will say so regardless of any affiliate relationship. Your trust is more valuable to us than any commission.</p>

        <h2 className="text-xl font-bold text-navy-900 mt-8 mb-4">Questions?</h2>
        <p>If you have any questions about our affiliate relationships, please contact us at disclosure@motionx.io.</p>
      </div>
    </div>
  );
}
