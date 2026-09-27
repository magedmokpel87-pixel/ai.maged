import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact AI.MAGED about books, partnerships, feedback, or site questions.",
  alternates: { canonical: "https://aimaged.com/contact" },
};

export default function ContactPage() {
  return (
    <main>
      <section className="py-12 bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Contact AI.MAGED</h1>
          <p className="text-gray-300 text-lg">Questions about a book, the library, or a partnership? Get in touch.</p>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-6">Get in Touch</h2>
            <div className="space-y-6 text-gray-600">
              <p>For questions about books, publishing links, site feedback, or future partnerships, use the contact details provided by the site owner.</p>
              <p className="text-sm text-gray-500 pt-4 border-t">We aim to keep the library focused, clear, and useful.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
