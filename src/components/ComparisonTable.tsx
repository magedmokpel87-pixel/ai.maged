import { Product } from "@/data/products";
import CTAButton from "./CTAButton";

interface ComparisonTableProps {
  product1: Product;
  product2: Product;
}

export default function ComparisonTable({ product1, product2 }: ComparisonTableProps) {
  const features = ["Commission", "Commission Type", "Buyer Intent", "Best For"];
  
  const getValue = (product: Product, feature: string): string => {
    switch (feature) {
      case "Commission": return product.commission;
      case "Commission Type": return product.commissionType;
      case "Buyer Intent": return product.buyerIntent;
      case "Best For": return product.bestFor;
      default: return "";
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-navy-900 text-white">
            <th className="p-4 text-left font-semibold">Feature</th>
            <th className="p-4 text-center font-semibold">{product1.name}</th>
            <th className="p-4 text-center font-semibold">{product2.name}</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, i) => (
            <tr key={feature} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
              <td className="p-4 font-medium text-gray-700">{feature}</td>
              <td className="p-4 text-center text-gray-600">{getValue(product1, feature)}</td>
              <td className="p-4 text-center text-gray-600">{getValue(product2, feature)}</td>
            </tr>
          ))}
          <tr className="bg-gray-50">
            <td className="p-4 font-medium text-gray-700">Key Features</td>
            <td className="p-4 text-center">
              <div className="flex flex-wrap justify-center gap-1">
                {product1.features.map(f => (
                  <span key={f} className="text-xs bg-blue-50 text-electric-500 px-2 py-1 rounded">{f}</span>
                ))}
              </div>
            </td>
            <td className="p-4 text-center">
              <div className="flex flex-wrap justify-center gap-1">
                {product2.features.map(f => (
                  <span key={f} className="text-xs bg-blue-50 text-electric-500 px-2 py-1 rounded">{f}</span>
                ))}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
        <CTAButton href={product1.affiliateLink} text={`Try ${product1.name}`} external />
        <CTAButton href={product2.affiliateLink} text={`Try ${product2.name}`} variant="outline" external />
      </div>
    </div>
  );
}
