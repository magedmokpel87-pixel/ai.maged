import Link from "next/link";
import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-electric-500 transition-all duration-200 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-bold text-navy-900">{product.name}</h3>
        <span className="text-xs font-medium bg-blue-50 text-electric-500 px-2 py-1 rounded-full">
          {product.commission}
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-4 flex-grow">{product.tagline}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {product.features.slice(0, 3).map((feature) => (
          <span key={feature} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
            {feature}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-500">{product.categoryName}</span>
        <Link
          href={`/tools/${product.id}`}
          className="text-sm font-medium text-electric-500 hover:text-electric-600 transition-colors"
        >
          Read Review &rarr;
        </Link>
      </div>
    </div>
  );
}
