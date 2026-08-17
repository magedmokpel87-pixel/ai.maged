import { Metadata } from "next";
import { getProductById } from "@/data/products";
import ComparisonTable from "@/components/ComparisonTable";
import JsonLd from "@/components/JsonLd";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

const comparisons: Record<string, { id1: string; id2: string; title: string; description: string }> = {
  "systeme-io-vs-hubspot": {
    id1: "systeme-io",
    id2: "hubspot",
    title: "Systeme.io vs HubSpot",
    description: "Choosing between Systeme.io and HubSpot? Both are powerful marketing platforms but built for very different users. Systeme.io is the affordable all-in-one for solopreneurs, while HubSpot is the enterprise-grade CRM for growing teams.",
  },
  "best-ai-writing-tools": {
    id1: "jasper-ai",
    id2: "notion",
    title: "Best AI Writing Tools",
    description: "Looking for the best AI writing tool? Jasper AI leads the pack for marketing content, while Notion offers flexible AI-assisted writing for teams. We compare their approaches to help you decide.",
  },
  "best-digital-marketing-courses": {
    id1: "coursera",
    id2: "hubspot",
    title: "Best Digital Marketing Courses",
    description: "Want to learn digital marketing? Coursera offers university-backed certifications, while HubSpot Academy provides free practical training. Here is how they compare for different learning goals.",
  },
};

export function generateStaticParams(): { slug: string }[] {
  return Object.keys(comparisons).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const comp = comparisons[slug];
  if (!comp) return {};
  return {
    title: `${comp.title} - Which is Better in 2026?`,
    description: `${comp.title} comparison: Features, pricing, pros & cons side by side. Find out which tool is right for your business.`,
  };
}

export default async function ComparePage({ params }: Props) {
  const { slug } = await params;
  const comp = comparisons[slug];
  if (!comp) notFound();

  const product1 = getProductById(comp.id1);
  const product2 = getProductById(comp.id2);
  if (!product1 || !product2) notFound();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://motionx.io" },
            { "@type": "ListItem", position: 2, name: "Comparisons", item: "https://motionx.io/compare" },
            { "@type": "ListItem", position: 3, name: comp.title, item: `https://motionx.io/compare/${slug}` },
          ],
        }}
      />

      {/* Breadcrumbs */}
      <div className="bg-navy-800 border-b border-navy-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex text-sm text-gray-400">
            <Link href="/" className="hover:text-electric-500">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white font-medium">{comp.title}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="py-12 bg-navy-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{comp.title}</h1>
          <p className="text-gray-300 text-lg">Which is the better choice for your business in 2026?</p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 bg-navy-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-lg text-gray-300 leading-relaxed mb-8">{comp.description}</p>
          <ComparisonTable product1={product1} product2={product2} />
        </div>
      </section>

      {/* Verdict */}
      <section className="py-12 bg-navy-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Our Verdict</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-navy-700 rounded-xl p-6 border border-navy-600">
              <h3 className="text-xl font-bold text-white mb-3">Choose {product1.name} if:</h3>
              <p className="text-gray-300">{product1.bestFor}</p>
              <div className="mt-4">
                <Link href={`/tools/${product1.id}`} className="text-electric-500 font-medium hover:underline">
                  Read full review
                </Link>
              </div>
            </div>
            <div className="bg-navy-700 rounded-xl p-6 border border-navy-600">
              <h3 className="text-xl font-bold text-white mb-3">Choose {product2.name} if:</h3>
              <p className="text-gray-300">{product2.bestFor}</p>
              <div className="mt-4">
                <Link href={`/tools/${product2.id}`} className="text-electric-500 font-medium hover:underline">
                  Read full review
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
