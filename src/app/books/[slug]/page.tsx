import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedBook } from "@/lib/books";
import BookCover from "@/components/BookCover";
import BookFileLink from "@/components/BookFileLink";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const book = await getPublishedBook(params.slug);
  if (!book) return { title: "Book not found" };

  return {
    title: book.title,
    description: book.description || `Read about ${book.title} on AI.MAGED.`,
    alternates: { canonical: `https://aimaged.com/books/${book.slug}` },
    openGraph: {
      type: "website",
      title: book.title,
      description: book.description || `Read about ${book.title} on AI.MAGED.`,
      url: `https://aimaged.com/books/${book.slug}`,
    },
  };
}

export default async function BookPage({ params }: { params: { slug: string } }) {
  const book = await getPublishedBook(params.slug);
  if (!book) notFound();

  return (
    <main className="bg-navy-900 min-h-screen text-white">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <Link href="/books" className="text-sm text-gray-400 hover:text-white">← Back to books</Link>

        <div className="grid lg:grid-cols-[320px_1fr] gap-10 mt-8">
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-navy-800 aspect-[3/4]">
            <BookCover book={book} priority />
          </div>

          <article>
            {book.category && <p className="text-xs uppercase tracking-widest text-electric-500 mb-3">{book.category}</p>}
            <h1 className="text-4xl sm:text-5xl font-bold font-display mb-3">{book.title}</h1>
            {book.subtitle && <p className="text-xl text-gray-300 mb-4">{book.subtitle}</p>}
            {book.author && <p className="text-gray-400 mb-8">By {book.author}</p>}

            <div className="flex flex-wrap gap-2 mb-8">
              {book.language && <span className="px-3 py-1 rounded-full bg-navy-800 border border-white/10 text-sm">{book.language}</span>}
              {book.format && <span className="px-3 py-1 rounded-full bg-navy-800 border border-white/10 text-sm">{book.format}</span>}
              {book.publicationYear && <span className="px-3 py-1 rounded-full bg-navy-800 border border-white/10 text-sm">{book.publicationYear}</span>}
            </div>

            {book.description && <p className="text-gray-300 leading-8 text-lg mb-8">{book.description}</p>}

            {book.tags && book.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {book.tags.map((tag) => <span key={tag} className="text-xs text-gray-400 border border-white/10 rounded-full px-3 py-1">{tag}</span>)}
              </div>
            )}

            <BookFileLink fileKey={book.fileKey} externalUrl={book.externalUrl} visibility={book.visibility} />
            {book.isbn && <p className="text-sm text-gray-500 mt-8">ISBN: {book.isbn}</p>}
          </article>
        </div>
      </section>
    </main>
  );
}
