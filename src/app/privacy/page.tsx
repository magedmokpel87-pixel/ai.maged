import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "AI.MAGED privacy policy.",
  alternates: { canonical: "https://aimaged.com/privacy" },
  robots: { index: true, follow: false },
};

export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-navy-900 mb-8">Privacy Policy</h1>
      <div className="prose prose-lg max-w-none text-gray-700">
        <p className="text-sm text-gray-500 mb-8">Last updated: September 2026</p>
        <h2>1. Information We Collect</h2>
        <p>AI.MAGED aims to collect only the information needed to operate the website, protect the private admin area, and respond to messages you voluntarily send.</p>
        <h2>2. Book and Site Data</h2>
        <p>Book information added by the site administrator may be stored in the website database. Publicly displayed book information is intended for visitors to view.</p>
        <h2>3. Files</h2>
        <p>Book covers, book files, and advertisement images uploaded by the administrator are stored using the website&apos;s cloud storage service. Access rules determine whether a file is public or private.</p>
        <h2>4. Third Parties</h2>
        <p>Some book links may point to third-party websites. Those websites have their own privacy policies and terms.</p>
        <h2>5. Security</h2>
        <p>We use reasonable technical controls to protect site data, but no internet service can guarantee absolute security.</p>
        <h2>6. Contact</h2>
        <p>For privacy questions, use the contact information published on the Contact page.</p>
      </div>
    </main>
  );
}
