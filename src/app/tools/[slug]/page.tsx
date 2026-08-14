import { notFound } from "next/navigation";
import { Metadata } from "next";
import { products, getProductById, getAllProductIds, getProductsByCategory } from "@/data/products";
import CTAButton from "@/components/CTAButton";
import ProductCard from "@/components/ProductCard";
import JsonLd from "@/components/JsonLd";
import Link from "next/link";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllProductIds().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const product = getProductById(params.slug);
  if (!product) return {};
  return {
    title: `${product.name} Review 2026 - Features, Pricing & Verdict`,
    description: `${product.name} review: ${product.tagline} Read our honest analysis of features, pros, cons, and who it's best for.`,
  };
}

export default function ToolPage({ params }: Props) {
  const product = getProductById(params.slug);
  if (!product) notFound();

  const relatedProducts = getProductsByCategory(product.category).filter(p => p.id !== product.id);
  const otherProducts = relatedProducts.length > 0 ? relatedProducts : products.filter(p => p.id !== product.id).slice(0, 2);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.description,
          category: product.categoryName,
          review: {
            "@type": "Review",
            author: { "@type": "Organization", name: "MOTION.X" },
            reviewBody: product.description,
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://motionx.io" },
            { "@type": "ListItem", position: 2, name: product.categoryName, item: `https://motionx.io/category/${product.category}` },
            { "@type": "ListItem", position: 3, name: product.name, item: `https://motionx.io/tools/${product.id}` },
          ],
        }}
      />

      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex text-sm text-gray-500">
            <Link href="/" className="hover:text-electric-500">Home</Link>
            <span className="mx-2">/</span>
            <Link href={`/category/${product.category}`} className="hover:text-electric-500">{product.categoryName}</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Header */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-3">{product.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{product.tagline}</p>
              <div className="flex flex-wrap gap-2">
                {product.features.map((feature) => (
                  <span key={feature} className="text-sm bg-blue-50 text-electric-500 px-3 py-1 rounded-full font-medium">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <p className="text-sm text-gray-500 mb-1">Affiliate Commission</p>
                <p className="text-2xl font-bold text-electric-500">{product.commission}</p>
                <p className="text-xs text-gray-400 mt-1">{product.commissionType}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="prose prose-lg max-w-none">
            {/* Description */}
            <div className="bg-white rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-4">What is {product.name}?</h2>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6">
                <h3 className="text-lg font-bold text-green-700 mb-4 flex items-center">
                  <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2 text-sm">+</span>
                  Pros
                </h3>
                <ul className="space-y-3">
                  {product.pros.map((pro) => (
                    <li key={pro} className="flex items-start text-gray-700">
                      <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h3 className="text-lg font-bold text-red-700 mb-4 flex items-center">
                  <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-2 text-sm">-</span>
                  Cons
                </h3>
                <ul className="space-y-3">
                  {product.cons.map((con) => (
                    <li key={con} className="flex items-start text-gray-700">
                      <svg className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Best For */}
            <div className="bg-white rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-4">Who is {product.name} Best For?</h2>
              <p className="text-gray-700 text-lg">{product.bestFor}</p>
            </div>

            {/* CTA */}
            <div className="bg-navy-900 rounded-xl p-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-3">Ready to Try {product.name}?</h2>
              <p className="text-gray-300 mb-6">{product.cta}</p>
              <CTAButton href={product.affiliateLink} text={`Try ${product.name} Now`} size="lg" external />
              <p className="text-xs text-gray-500 mt-4">
                * Affiliate link. We may earn a commission at no extra cost to you.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* Related Products */}
      {otherProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-6 text-center">You Might Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherProducts.slice(0, 3).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
