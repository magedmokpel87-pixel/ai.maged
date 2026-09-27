"use client";

import { useEffect, useState } from "react";
import { fetchAuthSession, getCurrentUser, signIn, signOut } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import { getUrl, uploadData } from "aws-amplify/storage";
import type { Schema } from "../../../amplify/data/resource";

const client = generateClient<Schema>({ authMode: "userPool" });

type BookForm = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  category: string;
  language: string;
  description: string;
  tags: string;
  isbn: string;
  publicationYear: string;
  format: string;
  externalUrl: string;
  visibility: "public" | "private";
  published: boolean;
  featured: boolean;
  coverFile: File | null;
  bookFile: File | null;
};

const emptyBook: BookForm = {
  id: "",
  slug: "",
  title: "",
  subtitle: "",
  author: "",
  category: "",
  language: "",
  description: "",
  tags: "",
  isbn: "",
  publicationYear: "",
  format: "",
  externalUrl: "",
  visibility: "public",
  published: false,
  featured: false,
  coverFile: null,
  bookFile: null,
};

type AdForm = {
  id: string;
  name: string;
  placement: string;
  headline: string;
  linkUrl: string;
  active: boolean;
  imageFile: File | null;
};

const emptyAd: AdForm = {
  id: "",
  name: "",
  placement: "homepage",
  headline: "",
  linkUrl: "",
  active: false,
  imageFile: null,
};

function isAdmin(session: Awaited<ReturnType<typeof fetchAuthSession>>) {
  const groups = session.tokens?.accessToken?.payload?.["cognito:groups"] ??
    session.tokens?.idToken?.payload?.["cognito:groups"];
  return Array.isArray(groups) && groups.map(String).includes("ADMINS");
}

const inputClass = "w-full rounded-lg bg-navy-900 border border-white/10 p-3 text-white placeholder:text-gray-500 outline-none focus:border-electric-500";
const labelClass = "block text-sm text-gray-300 mb-1";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ready, setReady] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [message, setMessage] = useState("");
  const [tab, setTab] = useState<"books" | "ads">("books");
  const [books, setBooks] = useState<Schema["Book"]["type"][]>([]);
  const [ads, setAds] = useState<Schema["Ad"]["type"][]>([]);
  const [bookForm, setBookForm] = useState<BookForm>(emptyBook);
  const [adForm, setAdForm] = useState<AdForm>(emptyAd);

  async function refresh() {
    setMessage("");
    try {
      const session = await fetchAuthSession();
      const hasTokens = Boolean(session.tokens?.accessToken);
      const hasAdmin = isAdmin(session);
      setReady(hasTokens);
      setAdmin(hasAdmin);
      if (!hasAdmin) return;

      const [bookResult, adResult] = await Promise.all([
        client.models.Book.list({ authMode: "userPool" }),
        client.models.Ad.list({ authMode: "userPool" }),
      ]);

      setBooks((bookResult.data ?? []) as Schema["Book"]["type"][]);
      setAds((adResult.data ?? []) as Schema["Ad"]["type"][]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load the control panel.");
    }
  }

  useEffect(() => { void refresh(); }, []);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    try {
      await signIn({ username: email.trim(), password });
      setPassword("");
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login failed.");
    }
  }

  async function logout() {
    await signOut();
    setReady(false);
    setAdmin(false);
    setBooks([]);
    setAds([]);
    setBookForm(emptyBook);
    setAdForm(emptyAd);
  }

  async function saveBook(event: React.FormEvent) {
    event.preventDefault();
    setMessage("Saving book...");
    try {
      const slug = bookForm.slug.trim().toLowerCase().replace(/\s+/g, "-");
      if (!slug || !bookForm.title.trim()) throw new Error("Title and slug are required.");

      const safeFileName = (name: string) => name.replace(/[^a-zA-Z0-9._-]+/g, "-");
      let coverKey = books.find((b) => b.id === bookForm.id)?.coverKey ?? undefined;
      let fileKey = books.find((b) => b.id === bookForm.id)?.fileKey ?? undefined;

      if (bookForm.coverFile) {
        coverKey = `covers/${slug}-${Date.now()}-${safeFileName(bookForm.coverFile.name)}`;
        await uploadData({
          path: coverKey,
          data: bookForm.coverFile,
          options: { contentType: bookForm.coverFile.type || "image/jpeg", preventOverwrite: true },
        }).result;
      }

      if (bookForm.bookFile) {
        const folder = bookForm.visibility === "public" ? "books/public" : "books/private";
        fileKey = `${folder}/${slug}-${Date.now()}-${safeFileName(bookForm.bookFile.name)}`;
        await uploadData({
          path: fileKey,
          data: bookForm.bookFile,
          options: { contentType: bookForm.bookFile.type || "application/octet-stream", preventOverwrite: true },
        }).result;
      }

      const payload = {
        slug,
        title: bookForm.title.trim(),
        subtitle: bookForm.subtitle.trim() || undefined,
        author: bookForm.author.trim() || undefined,
        category: bookForm.category.trim() || undefined,
        language: bookForm.language.trim() || undefined,
        description: bookForm.description.trim() || undefined,
        tags: bookForm.tags.split(",").map((x) => x.trim()).filter(Boolean),
        isbn: bookForm.isbn.trim() || undefined,
        publicationYear: bookForm.publicationYear ? Number(bookForm.publicationYear) : undefined,
        format: bookForm.format.trim() || undefined,
        coverKey,
        fileKey,
        externalUrl: bookForm.externalUrl.trim() || undefined,
        visibility: bookForm.visibility,
        published: bookForm.published,
        featured: bookForm.featured,
        sortOrder: 0,
      };

      if (bookForm.id) {
        await client.models.Book.update({ id: bookForm.id, ...payload }, { authMode: "userPool" });
        setMessage("Book updated.");
      } else {
        await client.models.Book.create(payload, { authMode: "userPool" });
        setMessage("Book added.");
      }

      setBookForm(emptyBook);
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Book save failed.");
    }
  }

  async function deleteBook(id: string) {
    if (!window.confirm("Delete this book record?")) return;
    try {
      await client.models.Book.delete({ id }, { authMode: "userPool" });
      setBookForm(emptyBook);
      await refresh();
      setMessage("Book deleted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Book deletion failed.");
    }
  }

  async function previewFile(key?: string | null) {
    if (!key) return;
    try {
      const result = await getUrl({ path: key });
      window.open(result.url.toString(), "_blank", "noopener,noreferrer");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not open file.");
    }
  }

  async function saveAd(event: React.FormEvent) {
    event.preventDefault();
    setMessage("Saving ad...");
    try {
      let imageKey = ads.find((a) => a.id === adForm.id)?.imageKey ?? undefined;
      const safeFileName = (name: string) => name.replace(/[^a-zA-Z0-9._-]+/g, "-");

      if (adForm.imageFile) {
        const base = adForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        imageKey = `ads/${base}-${Date.now()}-${safeFileName(adForm.imageFile.name)}`;
        await uploadData({
          path: imageKey,
          data: adForm.imageFile,
          options: { contentType: adForm.imageFile.type || "image/jpeg", preventOverwrite: true },
        }).result;
      }

      const payload = {
        name: adForm.name.trim(),
        placement: adForm.placement.trim(),
        headline: adForm.headline.trim() || undefined,
        linkUrl: adForm.linkUrl.trim() || undefined,
        imageKey,
        active: adForm.active,
        sortOrder: 0,
      };

      if (adForm.id) {
        await client.models.Ad.update({ id: adForm.id, ...payload }, { authMode: "userPool" });
        setMessage("Ad updated.");
      } else {
        await client.models.Ad.create(payload, { authMode: "userPool" });
        setMessage("Ad added.");
      }

      setAdForm(emptyAd);
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Ad save failed.");
    }
  }

  async function deleteAd(id: string) {
    if (!window.confirm("Delete this ad record?")) return;
    await client.models.Ad.delete({ id }, { authMode: "userPool" });
    setAdForm(emptyAd);
    await refresh();
    setMessage("Ad deleted.");
  }

  if (!ready) {
    return (
      <main className="min-h-screen bg-navy-900 text-white px-4 py-20">
        <div className="max-w-md mx-auto rounded-2xl border border-white/10 bg-navy-800 p-8">
          <p className="text-xs uppercase tracking-widest text-electric-500 mb-3">AI.MAGED CONTROL</p>
          <h1 className="text-3xl font-bold mb-3">Admin Login</h1>
          <p className="text-sm text-gray-400 mb-6">Private area for managing your book library and advertisements.</p>
          <form onSubmit={login} className="space-y-4">
            <input className={inputClass} type="email" placeholder="Admin email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input className={inputClass} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button className="w-full rounded-lg bg-electric-500 p-3 font-semibold">Sign in</button>
          </form>
          {message && <p className="mt-4 text-sm text-red-300">{message}</p>}
        </div>
      </main>
    );
  }

  if (!admin) {
    return (
      <main className="min-h-screen bg-navy-900 text-white px-4 py-20">
        <div className="max-w-xl mx-auto rounded-2xl border border-white/10 bg-navy-800 p-8">
          <h1 className="text-2xl font-bold mb-3">This account is not an administrator.</h1>
          <p className="text-gray-400 mb-6">The signed-in account must belong to the <strong>ADMINS</strong> group.</p>
          <button onClick={logout} className="rounded-lg border border-white/10 px-4 py-2">Sign out</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-navy-900 text-white px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-electric-500 mb-2">AI.MAGED CONTROL</p>
            <h1 className="text-3xl md:text-4xl font-bold">Site Admin</h1>
            <p className="text-gray-400 mt-2">Add only the books you choose. Nothing is published automatically.</p>
          </div>
          <button onClick={logout} className="rounded-lg border border-white/10 px-4 py-2 text-sm">Sign out</button>
        </div>

        {message && <div className="mb-6 rounded-lg border border-white/10 bg-navy-800 p-3 text-sm">{message}</div>}

        <div className="grid grid-cols-2 gap-3 mb-8">
          <button onClick={() => setTab("books")} className={`rounded-xl p-4 border text-left ${tab === "books" ? "border-electric-500 bg-electric-500/10" : "border-white/10 bg-navy-800"}`}>
            <div className="text-2xl font-bold">{books.length}</div><div className="text-xs uppercase tracking-widest text-gray-400">Books</div>
          </button>
          <button onClick={() => setTab("ads")} className={`rounded-xl p-4 border text-left ${tab === "ads" ? "border-electric-500 bg-electric-500/10" : "border-white/10 bg-navy-800"}`}>
            <div className="text-2xl font-bold">{ads.length}</div><div className="text-xs uppercase tracking-widest text-gray-400">Ads</div>
          </button>
        </div>

        {tab === "books" ? (
          <div className="grid lg:grid-cols-[390px_1fr] gap-6">
            <form onSubmit={saveBook} className="rounded-2xl bg-navy-800 border border-white/10 p-5 space-y-4 h-fit">
              <div><h2 className="text-xl font-bold">{bookForm.id ? "Edit Book" : "Add Book"}</h2><p className="text-sm text-gray-500 mt-1">You decide what enters the library.</p></div>

              <div><label className={labelClass}>Title</label><input className={inputClass} value={bookForm.title} onChange={(e) => setBookForm(v => ({...v,title:e.target.value}))} required /></div>
              <div><label className={labelClass}>Slug</label><input className={inputClass} value={bookForm.slug} onChange={(e) => setBookForm(v => ({...v,slug:e.target.value}))} placeholder="my-book-name" required /></div>
              <div><label className={labelClass}>Author</label><input className={inputClass} value={bookForm.author} onChange={(e) => setBookForm(v => ({...v,author:e.target.value}))} /></div>
              <div><label className={labelClass}>Category / type</label><input className={inputClass} value={bookForm.category} onChange={(e) => setBookForm(v => ({...v,category:e.target.value}))} placeholder="Fiction, Business, Children..." /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelClass}>Language</label><input className={inputClass} value={bookForm.language} onChange={(e) => setBookForm(v => ({...v,language:e.target.value}))} /></div>
                <div><label className={labelClass}>Format</label><input className={inputClass} value={bookForm.format} onChange={(e) => setBookForm(v => ({...v,format:e.target.value}))} placeholder="PDF / EPUB" /></div>
              </div>
              <div><label className={labelClass}>Subtitle</label><input className={inputClass} value={bookForm.subtitle} onChange={(e) => setBookForm(v => ({...v,subtitle:e.target.value}))} /></div>
              <div><label className={labelClass}>Description</label><textarea className={inputClass + " min-h-32"} value={bookForm.description} onChange={(e) => setBookForm(v => ({...v,description:e.target.value}))} /></div>
              <div><label className={labelClass}>Tags (comma separated)</label><input className={inputClass} value={bookForm.tags} onChange={(e) => setBookForm(v => ({...v,tags:e.target.value}))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelClass}>ISBN</label><input className={inputClass} value={bookForm.isbn} onChange={(e) => setBookForm(v => ({...v,isbn:e.target.value}))} /></div>
                <div><label className={labelClass}>Year</label><input className={inputClass} type="number" value={bookForm.publicationYear} onChange={(e) => setBookForm(v => ({...v,publicationYear:e.target.value}))} /></div>
              </div>
              <div><label className={labelClass}>External book link</label><input className={inputClass} type="url" value={bookForm.externalUrl} onChange={(e) => setBookForm(v => ({...v,externalUrl:e.target.value}))} placeholder="https://..." /></div>

              <div className="space-y-3">
                <label className={labelClass}>Cover image</label>
                <input className="block w-full text-sm" type="file" accept="image/*" onChange={(e) => setBookForm(v => ({...v,coverFile:e.target.files?.[0] ?? null}))} />
                <label className={labelClass}>Book file</label>
                <input className="block w-full text-sm" type="file" accept=".pdf,.epub,.mobi" onChange={(e) => setBookForm(v => ({...v,bookFile:e.target.files?.[0] ?? null}))} />
              </div>

              <div className="flex flex-col gap-2 text-sm text-gray-300">
                <label><input type="radio" checked={bookForm.visibility === "public"} onChange={() => setBookForm(v => ({...v,visibility:"public"}))} /> Public file</label>
                <label><input type="radio" checked={bookForm.visibility === "private"} onChange={() => setBookForm(v => ({...v,visibility:"private"}))} /> Private file</label>
                <label><input type="checkbox" checked={bookForm.published} onChange={(e) => setBookForm(v => ({...v,published:e.target.checked}))} /> Publish on website</label>
                <label><input type="checkbox" checked={bookForm.featured} onChange={(e) => setBookForm(v => ({...v,featured:e.target.checked}))} /> Feature on homepage</label>
              </div>

              <div className="flex gap-2">
                <button className="rounded-lg bg-electric-500 px-4 py-2 font-semibold">{bookForm.id ? "Update Book" : "Add Book"}</button>
                {bookForm.id && <button type="button" className="rounded-lg border border-white/10 px-4 py-2" onClick={() => setBookForm(emptyBook)}>Cancel</button>}
              </div>
            </form>

            <div className="space-y-3">
              {books.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-navy-800 p-10 text-center text-gray-400">No books yet. Add your first chosen title from the form.</div>
              ) : books.map(book => (
                <div key={book.id} className="rounded-2xl border border-white/10 bg-navy-800 p-4 flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
                  <div>
                    <div className="font-semibold text-lg">{book.title}</div>
                    <div className="text-sm text-gray-400">{book.author || "No author"} · {book.category || "Uncategorized"}</div>
                    <div className="text-xs mt-1">{book.published ? "Published" : "Draft"} · {book.featured ? "Featured" : "Standard"}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {book.coverKey && <button className="border border-white/10 rounded-lg px-3 py-2 text-sm" onClick={() => previewFile(book.coverKey)}>Cover</button>}
                    {book.fileKey && <button className="border border-white/10 rounded-lg px-3 py-2 text-sm" onClick={() => previewFile(book.fileKey)}>File</button>}
                    <button className="border border-white/10 rounded-lg px-3 py-2 text-sm" onClick={() => setBookForm({
                      id: book.id, slug: book.slug, title: book.title, subtitle: book.subtitle || "", author: book.author || "",
                      category: book.category || "", language: book.language || "", description: book.description || "",
                      tags: (book.tags || []).join(", "), isbn: book.isbn || "", publicationYear: book.publicationYear?.toString() || "",
                      format: book.format || "", externalUrl: book.externalUrl || "", visibility: (book.visibility || "public") as "public" | "private",
                      published: Boolean(book.published), featured: Boolean(book.featured), coverFile: null, bookFile: null,
                    })}>Edit</button>
                    <button className="border border-red-400/30 text-red-300 rounded-lg px-3 py-2 text-sm" onClick={() => deleteBook(book.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[390px_1fr] gap-6">
            <form onSubmit={saveAd} className="rounded-2xl bg-navy-800 border border-white/10 p-5 space-y-4 h-fit">
              <h2 className="text-xl font-bold">{adForm.id ? "Edit Ad" : "Add Ad"}</h2>
              <div><label className={labelClass}>Ad name</label><input className={inputClass} value={adForm.name} onChange={(e) => setAdForm(v => ({...v,name:e.target.value}))} required /></div>
              <div><label className={labelClass}>Placement</label><input className={inputClass} value={adForm.placement} onChange={(e) => setAdForm(v => ({...v,placement:e.target.value}))} placeholder="homepage" required /></div>
              <div><label className={labelClass}>Headline</label><input className={inputClass} value={adForm.headline} onChange={(e) => setAdForm(v => ({...v,headline:e.target.value}))} /></div>
              <div><label className={labelClass}>Link</label><input className={inputClass} type="url" value={adForm.linkUrl} onChange={(e) => setAdForm(v => ({...v,linkUrl:e.target.value}))} /></div>
              <div><label className={labelClass}>Image</label><input className="block w-full text-sm" type="file" accept="image/*" onChange={(e) => setAdForm(v => ({...v,imageFile:e.target.files?.[0] ?? null}))} /></div>
              <label className="text-sm text-gray-300"><input type="checkbox" checked={adForm.active} onChange={(e) => setAdForm(v => ({...v,active:e.target.checked}))} /> Active</label>
              <div className="flex gap-2">
                <button className="rounded-lg bg-electric-500 px-4 py-2 font-semibold">{adForm.id ? "Update Ad" : "Add Ad"}</button>
                {adForm.id && <button type="button" className="rounded-lg border border-white/10 px-4 py-2" onClick={() => setAdForm(emptyAd)}>Cancel</button>}
              </div>
            </form>

            <div className="space-y-3">
              {ads.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-navy-800 p-10 text-center text-gray-400">No ads yet.</div>
              ) : ads.map(ad => (
                <div key={ad.id} className="rounded-2xl border border-white/10 bg-navy-800 p-4 flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
                  <div><div className="font-semibold">{ad.name}</div><div className="text-sm text-gray-400">{ad.placement} · {ad.headline || "No headline"}</div><div className="text-xs mt-1">{ad.active ? "Active" : "Inactive"}</div></div>
                  <div className="flex gap-2">
                    {ad.imageKey && <button className="border border-white/10 rounded-lg px-3 py-2 text-sm" onClick={() => previewFile(ad.imageKey)}>Image</button>}
                    <button className="border border-white/10 rounded-lg px-3 py-2 text-sm" onClick={() => setAdForm({ id:ad.id, name:ad.name, placement:ad.placement, headline:ad.headline || "", linkUrl:ad.linkUrl || "", active:Boolean(ad.active), imageFile:null })}>Edit</button>
                    <button className="border border-red-400/30 text-red-300 rounded-lg px-3 py-2 text-sm" onClick={() => deleteAd(ad.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
