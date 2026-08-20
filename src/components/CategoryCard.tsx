import Link from "next/link";
import { Category } from "@/data/categories";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="block bg-navy-700 border border-navy-600 rounded-xl p-6 hover:shadow-lg hover:border-electric-500 transition-all duration-200"
    >
      <div className="text-3xl mb-3">{category.icon}</div>
      <h3 className="text-lg font-bold text-white mb-2">{category.name}</h3>
      <p className="text-sm text-gray-400">{category.description}</p>
    </Link>
  );
}
