"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getUrl } from "aws-amplify/storage";
import type { Schema } from "@/amplify/data/resource";

export default function BookCover({
  book,
  priority = false,
}: {
  book: Schema["Book"]["type"];
  priority?: boolean;
}) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    if (!book.coverKey) return;
    void getUrl({ path: book.coverKey })
      .then((result) => {
        if (alive) setUrl(result.url.toString());
      })
      .catch(() => {
        if (alive) setUrl(null);
      });
    return () => {
      alive = false;
    };
  }, [book.coverKey]);

  return (
    <div className="relative h-full w-full flex items-center justify-center bg-navy-700">
      {url ? (
        <Image src={url} alt={book.title} fill priority={priority} className="object-cover" sizes="(max-width: 1024px) 100vw, 33vw" />
      ) : (
        <div className="px-6 text-center">
          <div className="text-5xl mb-4">📚</div>
          <div className="text-xs uppercase tracking-widest text-gray-400">AI.MAGED</div>
          <div className="text-white font-semibold mt-2 line-clamp-3">{book.title}</div>
        </div>
      )}
    </div>
  );
}
