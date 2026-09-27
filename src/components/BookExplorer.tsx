"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Schema } from "../../amplify/data/resource";
import BookCover from "@/components/BookCover";

export default function BookExplorer({ books }: { books: Schema["Book"]["type"][] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => {
    const values = books.map((book) => book.category?.trim()).filter(Boolean);
    return ["All", ...Array.from(new Set(values as string[])).sort((a, b) => a.localeCompare(b))];
  }, [books]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter((book) => {
      const matchesCategory = category === "All" || book.category === category;
      const haystack = [
        book.title, book.subtitle, book.author, book.category, book.language, book.description,
        ...(book.tags ?? []),
      ].filter(Boolean).join(" ").toLowerCase();
      return matchesCategory && (!q || haystack.includes(q));
    });
  }, [books, category, query]);

  return (
    <section className="py-14 bg-navy-900 min-h-[60vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-4 mb-10">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search books, authors, subjects..."
            className="flex-1 rounded-xl bg-navy-800 border border-white/10 text-white placeholder:text-gray-500 px-4 py-3 outline-none focus:border-electric-500"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl bg-navy-800 border border-white/10 text-white px-4 py-3 outline-none focus:border-electric-500"
          >
            {categories.map((value) => <option key={value}>{value}</option>)}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-navy-800 p-12 text-center">
            <div className="text-5xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {books.length === 0 ? "The library is waiting for your first book." : "No books match this search."}
            </h2>
            <p className="text-gray-400">
              {books.length === 0
                ? "Nothing is added automatically. Published titles appear only after you add them from the admin area."
                : "Try another title, author, subject, or category."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((book) => (
              <Link key={book.id} href={`/books/${book.slug}`} className="group rounded-2xl overflow-hidden border border-white/10 bg-navy-800 hover:border-electric-500/50 transition">
                <div className="aspect-[3/4] bg-navy-700"><BookCover book={book} /></div>
                <div className="p-5">
                  <p className="text-xs text-electric-500 uppercase tracking-wider mb-2">{book.category || "Book"}</p>
                  <h2 className="text-lg font-bold text-white group-hover:text-electric-500 transition line-clamp-2">{book.title}</h2>
                  {book.author && <p className="text-sm text-gray-400 mt-1">{book.author}</p>}
                  {book.language && <p className="text-xs text-gray-500 mt-2">{book.language}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
