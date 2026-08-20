import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "MOTION.X privacy policy. Learn how we collect, use, and protect your information.",
  alternates: {
    canonical: "https://motionx.io/privacy",
  },
  robots: {
    index: true,
    follow: false,
  },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-navy-900 mb-8">Privacy Policy</h1>
      <div className="prose prose-lg max-w-none text-gray-700">
        <p className="text-sm text-gray-500 mb-8">Last updated: August 2026</p>
        
        <h2 className="text-xl font-bold text-navy-900 mt-8 mb-4">1. Information We Collect</h2>
        <p>MOTION.X collects minimal information. We may collect:</p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>Anonymous usage data through analytics tools (page views, click patterns)</li>
          <li>Information you voluntarily provide (e.g., contact form submissions)</li>
          <li>Cookies for analytics and functionality purposes</li>
        </ul>

        <h2 className="text-xl font-bold text-navy-900 mt-8 mb-4">2. How We Use Information</h2>
        <p>We use collected information to:</p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>Improve our content and user experience</li>
          <li>Understand which tools and content our visitors find most useful</li>
          <li>Maintain and optimize our website</li>
        </ul>

        <h2 className="text-xl font-bold text-navy-900 mt-8 mb-4">3. Affiliate Links & Third Parties</h2>
        <p>Our site contains affiliate links to third-party products and services. When you click these links, the third party may collect information about you according to their own privacy policies. We encourage you to review the privacy policies of any third-party sites you visit.</p>

        <h2 className="text-xl font-bold text-navy-900 mt-8 mb-4">4. Cookies</h2>
        <p>We use cookies for:</p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>Analytics (understanding how visitors use our site)</li>
          <li>Affiliate tracking (so we receive credit for referrals)</li>
        </ul>
        <p>You can disable cookies in your browser settings, though some functionality may be affected.</p>

        <h2 className="text-xl font-bold text-navy-900 mt-8 mb-4">5. Data Security</h2>
        <p>We implement reasonable security measures to protect any information we collect. However, no internet transmission is 100% secure.</p>

        <h2 className="text-xl font-bold text-navy-900 mt-8 mb-4">6. Contact</h2>
        <p>For privacy-related questions, contact us at privacy@motionx.io.</p>
      </div>
    </div>
  );
}
