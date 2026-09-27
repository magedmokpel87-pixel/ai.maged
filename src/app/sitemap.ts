import { MetadataRoute } from "next";
import { listPublishedBooks } from "@/lib/books";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://aimaged.com";
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: baseUrl + "/books", lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: baseUrl + "/about", lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: baseUrl + "/contact", lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.4 },
    { url: baseUrl + "/privacy", lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: baseUrl + "/terms", lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: baseUrl + "/affiliate-disclosure", lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  const books = await listPublishedBooks();
  const bookPages = books.map((book) => ({
    url: baseUrl + "/books/" + book.slug,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: book.featured ? 0.9 : 0.7,
  }));

  return [...staticPages, ...bookPages];
}