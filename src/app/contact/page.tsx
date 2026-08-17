import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with MOTION.X. Questions, feedback, or partnership inquiries.",
};

export default function ContactPage() {
  return (
    <>
      <section className="py-12 bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-300 text-lg">
            Have a question or want to work with us? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-6">Get in Touch</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-navy-900 mb-2">General Inquiries</h3>
                <p className="text-gray-600">
                  For questions about our reviews, tool recommendations, or feedback on the site.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-navy-900 mb-2">Partnership & Affiliate</h3>
                <p className="text-gray-600">
                  Interested in having your tool reviewed or partnering with MOTION.X? Let us know.
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-gray-500 text-sm">
                  We typically respond within 48 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
