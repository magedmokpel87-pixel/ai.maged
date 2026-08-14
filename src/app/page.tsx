import { products } from "@/data/products";
import { categories } from "@/data/categories";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import CTAButton from "@/components/CTAButton";

export default function Home() {
  const featuredProducts = products.slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Find the Right{" "}
              <span className="text-electric-500">AI & Marketing</span>{" "}
              Tools
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-8">
              Expert reviews and honest comparisons of the best tools for growing your business.
              No fluff, no hype — just the information you need to make the right choice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton href="#featured" text="Explore Tools" size="lg" />
              <CTAButton href="/about" text="How We Review" variant="outline" size="lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-electric-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-navy-900 mb-2">Honest Reviews</h3>
              <p className="text-gray-600 text-sm">Real pros and cons. We test tools and report what we find — no sugarcoating.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-electric-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-navy-900 mb-2">Side-by-Side Comparisons</h3>
              <p className="text-gray-600 text-sm">See how tools stack up against each other in clear, structured comparisons.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-electric-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-navy-900 mb-2">Save Time & Money</h3>
              <p className="text-gray-600 text-sm">Skip the trial-and-error. Find the right tool for your specific needs faster.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Featured Tools</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hand-picked tools that deliver real value. Each reviewed for features, pricing, and who they work best for.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Browse by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find tools organized by what they do. Each category has curated recommendations.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Tool?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Stop wasting time on tools that don&apos;t fit. Browse our curated reviews and make an informed decision.
          </p>
          <CTAButton href="/category/all-in-one-marketing" text="Start Exploring" size="lg" />
        </div>
      </section>
    </>
  );
}
