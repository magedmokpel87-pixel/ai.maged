"use client";

import { useEffect, useState } from "react";
import { getUrl } from "aws-amplify/storage";
import type { Schema } from "../../amplify/data/resource";

export default function AdBanner({ ads }: { ads: Schema["Ad"]["type"][] }) {
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    let alive = true;
    async function loadImages() {
      const entries = await Promise.all(
        ads.filter((ad) => ad.imageKey).map(async (ad) => {
          try {
            const result = await getUrl({ path: ad.imageKey as string });
            return [ad.id, result.url.toString()] as const;
          } catch {
            return null;
          }
        })
      );
      if (!alive) return;
      const next: Record<string, string> = {};
      for (const entry of entries) if (entry) next[entry[0]] = entry[1];
      setImageUrls(next);
    }
    void loadImages();
    return () => { alive = false; };
  }, [ads]);

  if (!ads.length) return null;

  return (
    <section className="bg-navy-800 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-3">
        {ads.map((ad) => {
          const content = (
            <div className="rounded-xl border border-white/10 bg-navy-900 overflow-hidden flex items-center gap-4 p-3 hover:border-electric-500/40 transition">
              {imageUrls[ad.id] && <img src={imageUrls[ad.id]} alt={ad.headline || ad.name} className="h-16 w-16 rounded-lg object-cover" />}
              <div>
                <p className="text-xs uppercase tracking-widest text-electric-500">Sponsored</p>
                <p className="text-white font-semibold">{ad.headline || ad.name}</p>
              </div>
            </div>
          );

          return ad.linkUrl ? (
            <a key={ad.id} href={ad.linkUrl} target="_blank" rel="noreferrer">{content}</a>
          ) : (
            <div key={ad.id}>{content}</div>
          );
        })}
      </div>
    </section>
  );
}
