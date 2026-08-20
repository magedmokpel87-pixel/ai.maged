import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tool Comparisons",
  description: "Side-by-side comparisons of the best AI and marketing tools. Find out which tool fits your needs.",
  alternates: {
    canonical: "https://motionx.io/compare",
  },
};

const allComparisons = [
  {
    slug: "systeme-io-vs-hubspot",
    title: "Systeme.io vs HubSpot",
    description: "Affordable all-in-one vs enterprise CRM — which fits your business?",
  },
  {
    slug: "best-ai-writing-tools",
    title: "Best AI Writing Tools",
    description: "Jasper and alternatives — the top AI tools for content creation.",
  },
  {
    slug: "best-digital-marketing-courses",
    title: "Best Digital Marketing Courses",
    description: "Coursera and top platforms for learning digital marketing skills.",
  },
];

export default function ComparePage() {
  return (
    <>
      <section className="py-12 bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Comparisons</h1>
          <p className="text-gray-300 text-lg">
            Side-by-side breakdowns to help you pick the right tool.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {allComparisons.map((comp) => (
              <Link
                key={comp.slug}
                href={`/compare/${comp.slug}`}
                className="block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-electric-500 transition-all"
              >
                <h2 className="text-xl font-bold text-navy-900 mb-2">{comp.title}</h2>
                <p className="text-gray-600">{comp.description}</p>
                <span className="text-electric-500 font-medium mt-3 inline-block">
                  Read comparison &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
