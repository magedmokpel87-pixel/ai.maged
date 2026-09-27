import { Metadata } from "next";
import { listPublishedBooks } from "@/lib/books";
import BookExplorer from "@/components/BookExplorer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Books",
  description: "Browse the AI.MAGED library of carefully selected books across subjects, genres, and languages.",
  alternates: { canonical: "https://aimaged.com/books" },
};

export default async function BooksPage() {
  const books = await listPublishedBooks();

  return (
    <main>
      <section className="relative bg-void text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <p className="text-xs uppercase tracking-widest text-electric-500 mb-3">AI.MAGED Library</p>
          <h1 className="text-4xl sm:text-5xl font-bold font-display mb-4">Books</h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            A focused collection of titles selected intentionally. Explore by subject, genre, language, or simply browse.
          </p>
        </div>
      </section>
      <BookExplorer books={books} />
    </main>
  );
}
