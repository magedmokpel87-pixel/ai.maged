"use client";

import { useState } from "react";
import { getUrl } from "aws-amplify/storage";

export default function BookFileLink({
  fileKey,
  externalUrl,
  visibility,
}: {
  fileKey?: string | null;
  externalUrl?: string | null;
  visibility?: string | null;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!fileKey && !externalUrl) return null;

  async function openFile() {
    setError("");
    if (externalUrl) {
      window.open(externalUrl, "_blank", "noopener,noreferrer");
      return;
    }
    if (!fileKey || visibility !== "public") {
      setError("This book file is not publicly available.");
      return;
    }

    setLoading(true);
    try {
      const result = await getUrl({ path: fileKey });
      window.open(result.url.toString(), "_blank", "noopener,noreferrer");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to open the book file.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={openFile} disabled={loading} className="rounded-lg bg-electric-500 px-5 py-3 font-semibold hover:opacity-90 disabled:opacity-60">
        {loading ? "Opening..." : externalUrl ? "Open Book Link" : "Open Book"}
      </button>
      {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
    </div>
  );
}
