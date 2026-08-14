import { Metadata } from "next";
import CTAButton from "@/components/CTAButton";

export const metadata: Metadata = {
  title: "About MOTION.X",
  description: "Learn about MOTION.X - our mission to help you find the right AI and marketing tools through honest reviews and expert comparisons.",
};

export default function AboutPage() {
  return (
    <>
      <section className="py-16 bg-navy-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">About MOTION.X</h1>
          <p className="text-gray-300 text-lg">Helping you find the right tools without the noise.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none text-gray-700">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">Our Mission</h2>
            <p>The world of AI and marketing tools is overwhelming. Hundreds of options, conflicting reviews, and aggressive marketing make it hard to know what actually works for your specific situation.</p>
            <p>MOTION.X exists to cut through that noise. We research, test, and compare tools so you can make an informed decision in minutes instead of hours.</p>

            <h2 className="text-2xl font-bold text-navy-900 mt-12 mb-4">How We Review</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose mb-8">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-navy-900 mb-2">Research-Based</h3>
                <p className="text-sm text-gray-600">Every review is based on thorough research of the product, its features, pricing, and real user experiences.</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-navy-900 mb-2">Honest Assessment</h3>
                <p className="text-sm text-gray-600">We list real pros AND cons. If a tool has problems, we say so. No sugar-coating.</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-navy-900 mb-2">Context Matters</h3>
                <p className="text-sm text-gray-600">A great tool for one person might be wrong for another. We always specify who each tool is best for.</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-navy-900 mb-2">Transparent</h3>
                <p className="text-sm text-gray-600">We use affiliate links and clearly disclose this. It never affects our editorial judgment.</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-navy-900 mt-12 mb-4">Affiliate Transparency</h2>
            <p>MOTION.X earns revenue through affiliate partnerships. When you click our links and make a purchase, we may earn a commission at no extra cost to you. This supports our work but never influences our recommendations. Read our full <a href="/affiliate-disclosure" className="text-electric-500 hover:underline">Affiliate Disclosure</a>.</p>
          </div>

          <div className="mt-12 text-center">
            <CTAButton href="/" text="Explore Our Reviews" size="lg" />
          </div>
        </div>
      </section>
    </>
  );
}
