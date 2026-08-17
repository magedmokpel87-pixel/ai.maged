import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Tools",
  description: "Browse all AI and marketing tools reviewed by MOTION.X. Find the right tool for your needs.",
};

export default function ToolsPage() {
  return (
    <>
      <section className="py-12 bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">All Tools</h1>
          <p className="text-gray-300 text-lg">
            Every tool we&apos;ve reviewed — honest assessments to help you choose.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
