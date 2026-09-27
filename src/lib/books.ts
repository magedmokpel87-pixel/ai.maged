import { cookies } from "next/headers";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/data";
import type { Schema } from "@/../amplify/data/resource";
import { loadAmplifyOutputs } from "@/lib/amplify-outputs";

export async function listPublishedBooks() {
  const config = loadAmplifyOutputs();
  if (!config) return [] as Schema["Book"]["type"][];

  try {
    const client = generateServerClientUsingCookies<Schema>({
      config: config as never,
      cookies,
    });

    const { data, errors } = await client.models.Book.list({ authMode: "apiKey" });
    if (errors?.length) return [];
    return ((data ?? []) as Schema["Book"]["type"][])
      .filter((book) => Boolean(book.published))
      .sort((a, b) => Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0));
  } catch {
    return [] as Schema["Book"]["type"][];
  }
}

export async function getPublishedBook(slug: string) {
  const books = await listPublishedBooks();
  return books.find((book) => book.slug === slug);
}
