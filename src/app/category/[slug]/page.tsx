import { notFound } from "next/navigation";
import { Metadata } from "next";
import { categories, getAllCategorySlugs, getCategoryBySlug } from "@/data/categories";
import { getProductsByCategory } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import JsonLd from "@/components/JsonLd";
import Link from "next/link";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllCategorySlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const category = getCategoryBySlug(params.slug);
  if (!category) return {};
  return {
    title: `Best ${category.name} Tools - Reviews & Comparisons`,
    description: `Discover the best ${category.name.toLowerCase()} tools. Expert reviews, honest comparisons, and recommendations to help you choose the right software.`,
  };
}

export default function CategoryPage({ params }: Props) {
  const category = getCategoryBySlug(params.slug);
  if (!category) notFound();

  const categoryProducts = getProductsByCategory(params.slug);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://motionx.io" },
            { "@type": "ListItem", position: 2, name: category.name, item: `https://motionx.io/category/${category.slug}` },
          ],
        }}
      />

      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex text-sm text-gray-500">
            <Link href="/" className="hover:text-electric-500">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="bg-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="text-4xl mb-4">{category.icon}</div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">{category.name}</h1>
            <p className="text-gray-300 text-lg">{category.description}</p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {categoryProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">More tools coming soon in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Other Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-navy-900 mb-6 text-center">Other Categories</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.filter(c => c.slug !== params.slug).map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:border-electric-500 hover:text-electric-500 transition-colors"
              >
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
