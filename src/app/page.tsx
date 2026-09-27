import { Metadata } from "next";
import Link from "next/link";
import { listPublishedBooks } from "@/lib/books";
import BookCover from "@/components/BookCover";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI.MAGED — Curated Books",
  description: "A focused library of carefully selected books across many subjects, genres, and languages.",
  alternates: { canonical: "https://aimaged.com" },
};

export default async function Home() {
  const books = await listPublishedBooks();
  const featured = books.filter((book) => book.featured).slice(0, 6);
  const showcase = featured.length ? featured : books.slice(0, 6);

  return (
    <>
      <div className="mesh"></div>
      <div className="grain"></div>

      <section className="relative bg-void text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-gold-bright border border-gold/35 bg-gold/6 px-3 py-1.5 rounded-full mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              A focused library • selected by AI.MAGED
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 font-display">
              Books worth your
              <span className="text-electric-500"> time</span>.
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Discover a clean, carefully selected collection of books. No random uploads. Every title is chosen intentionally.
            </p>
            <Link href="/books" className="inline-flex items-center justify-center rounded-lg bg-electric-500 px-6 py-3 font-semibold text-white hover:opacity-90 transition">
              Browse Books
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl mb-3">◈</div>
              <h2 className="text-lg font-bold text-white mb-2">Curated</h2>
              <p className="text-gray-400 text-sm">Only the books you choose to publish appear in the public library.</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">◎</div>
              <h2 className="text-lg font-bold text-white mb-2">Simple</h2>
              <p className="text-gray-400 text-sm">A clean reading-focused experience without unnecessary clutter.</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">↗</div>
              <h2 className="text-lg font-bold text-white mb-2">Built to grow</h2>
              <p className="text-gray-400 text-sm">The foundation supports more categories and courses later without rebuilding the site.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs uppercase tracking-widest text-electric-500 mb-2">Library</p>
              <h2 className="text-3xl font-bold text-white">Featured Books</h2>
            </div>
            <Link href="/books" className="text-sm text-gray-300 hover:text-white">View all →</Link>
          </div>

          {showcase.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-navy-800 p-10 text-center">
              <h3 className="text-xl font-semibold text-white mb-2">The library is ready.</h3>
              <p className="text-gray-400">Books will appear here after you publish the ones you choose from the admin area.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {showcase.map((book) => (
                <Link key={book.id} href={`/books/${book.slug}`} className="group rounded-2xl overflow-hidden border border-white/10 bg-navy-800 hover:border-electric-500/50 transition">
                  <div className="aspect-[3/4] bg-navy-700">
                    <BookCover book={book} priority={false} />
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-electric-500 uppercase tracking-wider mb-2">{book.category || "Book"}</p>
                    <h3 className="text-lg font-bold text-white group-hover:text-electric-500 transition">{book.title}</h3>
                    {book.author && <p className="text-sm text-gray-400 mt-1">{book.author}</p>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
