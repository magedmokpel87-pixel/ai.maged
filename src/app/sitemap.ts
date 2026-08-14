import { MetadataRoute } from "next";
import { getAllProductIds } from "@/data/products";
import { getAllCategorySlugs } from "@/data/categories";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://motionx.io";

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/affiliate-disclosure`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  const categoryPages = getAllCategorySlugs().map((slug) => ({
    url: `${baseUrl}/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const productPages = getAllProductIds().map((slug) => ({
    url: `${baseUrl}/tools/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const comparePages = [
    { url: `${baseUrl}/compare/systeme-io-vs-hubspot`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
  ];

  return [...staticPages, ...categoryPages, ...productPages, ...comparePages];
}
