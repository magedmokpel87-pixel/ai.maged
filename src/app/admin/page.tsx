"use client";

import { useEffect, useMemo, useState } from "react";
import {
  fetchAuthSession,
  getCurrentUser,
  signIn,
  signOut,
} from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import { getUrl, uploadData } from "aws-amplify/storage";
import type { Schema } from "../../../amplify/data/resource";
import { products as staticProducts } from "@/data/products";
import { categories as staticCategories } from "@/data/categories";

const client = generateClient<Schema>({ authMode: "userPool" });

type Tab = "tools" | "books" | "ads";

function isAdminSession(session: Awaited<ReturnType<typeof fetchAuthSession>>) {
  const groups =
    session.tokens?.accessToken?.payload?.["cognito:groups"] ??
    session.tokens?.idToken?.payload?.["cognito:groups"];
  return Array.isArray(groups) && groups.map(String).includes("ADMINS");
}

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userLabel, setUserLabel] = useState("");
  const [tab, setTab] = useState<Tab>("tools");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [tools, setTools] = useState<Schema["Product"]["type"][]>([]);
  const [books, setBooks] = useState<Schema["Book"]["type"][]>([]);
  const [ads, setAds] = useState<Schema["Ad"]["type"][]>([]);

  const [toolForm, setToolForm] = useState({
    id: "",
    slug: "",
    name: "",
    category: "",
    categoryName: "",
    tagline: "",
    description: "",
    affiliateLink: "",
    published: true,
  });

  const [bookForm, setBookForm] = useState({
    id: "",
    slug: "",
    title: "",
    author: "",
    description: "",
    visibility: "public" as "public" | "private",
    published: false,
    coverFile: null as File | null,
    bookFile: null as File | null,
  });

  const [adForm, setAdForm] = useState({
    id: "",
    name: "",
    placement: "homepage",
    headline: "",
    linkUrl: "",
    active: false,
    imageFile: null as File | null,
  });

  async function refresh() {
    setMessage("");
    setLoading(true);
    try {
      const session = await fetchAuthSession();
      const admin = isAdminSession(session);
      setSignedIn(Boolean(session.tokens));
      setIsAdmin(admin);
      if (session.tokens) {
        try {
          const current = await getCurrentUser();
          setUserLabel(current.username);
        } catch {
          setUserLabel("");
        }
      }
      if (!admin) return;

      const [toolResult, bookResult, adResult] = await Promise.all([
        client.models.Product.list({ authMode: "userPool" }),
        client.models.Book.list({ authMode: "userPool" }),
        client.models.Ad.list({ authMode: "userPool" }),
      ]);

      setTools((toolResult.data ?? []) as Schema["Product"]["type"][]);
      setBooks((bookResult.data ?? []) as Schema["Book"]["type"][]);
      setAds((adResult.data ?? []) as Schema["Ad"]["type"][]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load admin data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function handleLogin(event: React.FormEvent) {
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

  async function handleLogout() {
    await signOut();
    setSignedIn(false);
    setIsAdmin(false);
    setTools([]);
    setBooks([]);
    setAds([]);
    setMessage("Signed out.");
  }

  async function seedExistingCatalog() {
    setMessage("Importing current tools and categories...");
    try {
      const existingCategories = await client.models.Category.list({ authMode: "userPool" });
      const categorySlugs = new Set((existingCategories.data ?? []).map((x) => x.slug));

      for (const category of staticCategories) {
        if (categorySlugs.has(category.slug)) continue;
        await client.models.Category.create({
          slug: category.slug,
          name: category.name,
          description: category.description,
          icon: category.icon,
          productCount: undefined,
          sortOrder: 0,
          published: true,
        } as never);
      }

      const existingTools = await client.models.Product.list({ authMode: "userPool" });
      const toolSlugs = new Set((existingTools.data ?? []).map((x) => x.slug));

      for (const product of staticProducts) {
        if (toolSlugs.has(product.id)) continue;
        await client.models.Product.create({
          slug: product.id,
          name: product.name,
          category: product.category,
          categoryName: product.categoryName,
          tagline: product.tagline,
          description: product.description,
          commission: product.commission,
          commissionType: product.commissionType,
          buyerIntent: product.buyerIntent,
          pros: product.pros,
          cons: product.cons,
          bestFor: product.bestFor,
          cta: product.cta,
          affiliateLink: product.affiliateLink,
          features: product.features,
          published: true,
          sortOrder: 0,
        });
      }

      await refresh();
      setMessage("Existing catalog imported. Nothing was deleted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Catalog import failed.");
    }
  }

  async function saveTool(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    try {
      const input = {
        slug: toolForm.slug.trim(),
        name: toolForm.name.trim(),
        category: toolForm.category.trim() || undefined,
        categoryName: toolForm.categoryName.trim() || undefined,
        tagline: toolForm.tagline.trim() || undefined,
        description: toolForm.description.trim() || undefined,
        affiliateLink: toolForm.affiliateLink.trim() || undefined,
        published: toolForm.published,
      };

      if (toolForm.id) {
        await client.models.Product.update({ id: toolForm.id, ...input }, { authMode: "userPool" });
        setMessage("Tool updated.");
      } else {
        await client.models.Product.create(input, { authMode: "userPool" });
        setMessage("Tool created.");
      }

      setToolForm({
        id: "",
        slug: "",
        name: "",
        category: "",
        categoryName: "",
        tagline: "",
        description: "",
        affiliateLink: "",
        published: true,
      });
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Tool save failed.");
    }
  }

  async function deleteTool(id: string) {
    if (!window.confirm("Delete this tool?")) return;
    await client.models.Product.delete({ id }, { authMode: "userPool" });
    await refresh();
    setMessage("Tool deleted.");
  }

  async function saveBook(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    try {
      let coverKey: string | undefined;
      let fileKey: string | undefined;

      const slug = bookForm.slug.trim();
      const safeName = (name: string) => name.replace(/[^a-zA-Z0-9._-]+/g, "-");

      if (bookForm.coverFile) {
        coverKey = `covers/${slug}-${Date.now()}-${safeName(bookForm.coverFile.name)}`;
        await uploadData({
          path: coverKey,
          data: bookForm.coverFile,
          options: { contentType: bookForm.coverFile.type || "image/jpeg", preventOverwrite: true },
        }).result;
      }

      if (bookForm.bookFile) {
        const scope = bookForm.visibility === "public" ? "books/public" : "books/private";
        fileKey = `${scope}/${slug}-${Date.now()}-${safeName(bookForm.bookFile.name)}`;
        await uploadData({
          path: fileKey,
          data: bookForm.bookFile,
          options: {
            contentType: bookForm.bookFile.type || "application/octet-stream",
            contentDisposition: "attachment",
            preventOverwrite: true,
          },
        }).result;
      }

      const input = {
        slug,
        title: bookForm.title.trim(),
        author: bookForm.author.trim() || undefined,
        description: bookForm.description.trim() || undefined,
        coverKey,
        fileKey,
        visibility: bookForm.visibility,
        published: bookForm.published,
        sortOrder: 0,
      };

      if (bookForm.id) {
        await client.models.Book.update({ id: bookForm.id, ...input }, { authMode: "userPool" });
        setMessage("Book updated.");
      } else {
        await client.models.Book.create(input, { authMode: "userPool" });
        setMessage("Book created.");
      }

      setBookForm({
        id: "",
        slug: "",
        title: "",
        author: "",
        description: "",
        visibility: "public",
        published: false,
        coverFile: null,
        bookFile: null,
      });
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Book save failed.");
    }
  }

  async function deleteBook(id: string) {
    if (!window.confirm("Delete this book record?")) return;
    await client.models.Book.delete({ id }, { authMode: "userPool" });
    await refresh();
    setMessage("Book record deleted.");
  }

  async function saveAd(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    try {
      let imageKey: string | undefined;
      const safeName = (name: string) => name.replace(/[^a-zA-Z0-9._-]+/g, "-");

      if (adForm.imageFile) {
        imageKey = `ads/${adForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}-${safeName(adForm.imageFile.name)}`;
        await uploadData({
          path: imageKey,
          data: adForm.imageFile,
          options: { contentType: adForm.imageFile.type || "image/jpeg", preventOverwrite: true },
        }).result;
      }

      const input = {
        name: adForm.name.trim(),
        placement: adForm.placement.trim(),
        headline: adForm.headline.trim() || undefined,
        linkUrl: adForm.linkUrl.trim() || undefined,
        imageKey,
        active: adForm.active,
        sortOrder: 0,
      };

      if (adForm.id) {
        await client.models.Ad.update({ id: adForm.id, ...input }, { authMode: "userPool" });
        setMessage("Ad updated.");
      } else {
        await client.models.Ad.create(input, { authMode: "userPool" });
        setMessage("Ad created.");
      }

      setAdForm({
        id: "",
        name: "",
        placement: "homepage",
        headline: "",
        linkUrl: "",
        active: false,
        imageFile: null,
      });
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Ad save failed.");
    }
  }

  async function deleteAd(id: string) {
    if (!window.confirm("Delete this ad?")) return;
    await client.models.Ad.delete({ id }, { authMode: "userPool" });
    await refresh();
    setMessage("Ad deleted.");
  }

  async function previewKey(key?: string | null) {
    if (!key) return;
    try {
      const result = await getUrl({ path: key, options: { expiresIn: 300 } });
      window.open(result.url.toString(), "_blank", "noopener,noreferrer");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not generate file URL.");
    }
  }

  const counts = useMemo(
    () => ({ tools: tools.length, books: books.length, ads: ads.length }),
    [tools.length, books.length, ads.length]
  );

  if (!signedIn) {
    return (
      <main className="min-h-screen bg-navy-900 text-white px-4 py-20">
        <div className="max-w-md mx-auto bg-navy-800 rounded-2xl border border-white/10 p-8">
          <p className="text-xs uppercase tracking-widest text-electric-500 mb-3">AI.MAGED CONTROL</p>
          <h1 className="text-3xl font-bold mb-3">Admin Login</h1>
          <p className="text-gray-400 text-sm mb-6">
            This area is private. Your account must belong to the ADMINS group.
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              className="w-full rounded-lg bg-navy-900 border border-white/10 p-3"
              type="email"
              placeholder="Admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="w-full rounded-lg bg-navy-900 border border-white/10 p-3"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="w-full rounded-lg bg-electric-500 text-white font-semibold p-3 hover:opacity-90">
              Sign in
            </button>
          </form>
          {message && <p className="mt-4 text-sm text-red-300">{message}</p>}
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-navy-900 text-white px-4 py-20">
        <div className="max-w-xl mx-auto bg-navy-800 rounded-2xl border border-white/10 p-8">
          <h1 className="text-2xl font-bold mb-3">Account signed in, but not an admin</h1>
          <p className="text-gray-400 mb-6">
            {userLabel || "This account"} is authenticated, but it has no ADMINS group membership.
            Add the account to the ADMINS group in Cognito, then sign in again.
          </p>
          <button onClick={handleLogout} className="rounded-lg border border-white/15 px-4 py-2">
            Sign out
          </button>
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
            <p className="text-gray-400 mt-2">Manage tools, books, ads, and cloud files from one place.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={seedExistingCatalog} className="rounded-lg border border-electric-500/40 px-4 py-2 text-sm hover:bg-electric-500/10">
              Import current catalog
            </button>
            <button onClick={handleLogout} className="rounded-lg border border-white/10 px-4 py-2 text-sm">
              Sign out
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-6 rounded-lg border border-white/10 bg-navy-800 p-3 text-sm text-gray-200">
            {message}
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 mb-8">
          {(["tools", "books", "ads"] as Tab[]).map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`rounded-xl p-4 text-left border ${tab === item ? "border-electric-500 bg-electric-500/10" : "border-white/10 bg-navy-800"}`}
            >
              <div className="text-2xl font-bold">{counts[item]}</div>
              <div className="text-xs uppercase tracking-widest text-gray-400">{item}</div>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="bg-navy-800 rounded-xl p-6 text-gray-400">Loading...</div>
        ) : tab === "tools" ? (
          <div className="grid lg:grid-cols-[360px_1fr] gap-6">
            <form onSubmit={saveTool} className="bg-navy-800 rounded-xl p-5 space-y-3 h-fit">
              <h2 className="font-bold text-xl">{toolForm.id ? "Edit Tool" : "Add Tool"}</h2>
              {[
                ["name", "Name"],
                ["slug", "Slug"],
                ["category", "Category"],
                ["categoryName", "Category Name"],
                ["tagline", "Tagline"],
                ["affiliateLink", "Affiliate Link"],
              ].map(([field, label]) => (
                <input
                  key={field}
                  className="w-full rounded-lg bg-navy-900 border border-white/10 p-3"
                  placeholder={label}
                  value={String(toolForm[field as keyof typeof toolForm])}
                  onChange={(e) => setToolForm((v) => ({ ...v, [field]: e.target.value }))}
                  required={field === "name" || field === "slug"}
                />
              ))}
              <textarea
                className="w-full rounded-lg bg-navy-900 border border-white/10 p-3 min-h-32"
                placeholder="Description"
                value={toolForm.description}
                onChange={(e) => setToolForm((v) => ({ ...v, description: e.target.value }))}
              />
              <label className="flex gap-2 items-center text-sm text-gray-300">
                <input type="checkbox" checked={toolForm.published} onChange={(e) => setToolForm((v) => ({ ...v, published: e.target.checked }))} />
                Published
              </label>
              <div className="flex gap-2">
                <button className="rounded-lg bg-electric-500 px-4 py-2 font-semibold">Save</button>
                {toolForm.id && (
                  <button type="button" className="rounded-lg border border-white/10 px-4 py-2" onClick={() => setToolForm({
                    id: "", slug: "", name: "", category: "", categoryName: "", tagline: "", description: "", affiliateLink: "", published: true
                  })}>
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="space-y-3">
              {tools.map((tool) => (
                <div key={tool.id} className="bg-navy-800 rounded-xl p-4 border border-white/10 flex flex-col md:flex-row md:items-center gap-3 md:justify-between">
                  <div>
                    <div className="font-semibold">{tool.name}</div>
                    <div className="text-sm text-gray-400">/{tool.slug} · {tool.categoryName || tool.category || "Uncategorized"}</div>
                    <div className="text-xs mt-1">{tool.published ? "Published" : "Draft"}</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="border border-white/10 rounded-lg px-3 py-2 text-sm" onClick={() => setToolForm({
                      id: tool.id,
                      slug: tool.slug,
                      name: tool.name,
                      category: tool.category || "",
                      categoryName: tool.categoryName || "",
                      tagline: tool.tagline || "",
                      description: tool.description || "",
                      affiliateLink: tool.affiliateLink || "",
                      published: Boolean(tool.published),
                    })}>Edit</button>
                    <button className="border border-red-400/30 text-red-300 rounded-lg px-3 py-2 text-sm" onClick={() => deleteTool(tool.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : tab === "books" ? (
          <div className="grid lg:grid-cols-[360px_1fr] gap-6">
            <form onSubmit={saveBook} className="bg-navy-800 rounded-xl p-5 space-y-3 h-fit">
              <h2 className="font-bold text-xl">{bookForm.id ? "Edit Book" : "Add Book"}</h2>
              <input className="w-full rounded-lg bg-navy-900 border border-white/10 p-3" placeholder="Title" value={bookForm.title} onChange={(e) => setBookForm((v) => ({ ...v, title: e.target.value }))} required />
              <input className="w-full rounded-lg bg-navy-900 border border-white/10 p-3" placeholder="Slug" value={bookForm.slug} onChange={(e) => setBookForm((v) => ({ ...v, slug: e.target.value }))} required />
              <input className="w-full rounded-lg bg-navy-900 border border-white/10 p-3" placeholder="Author" value={bookForm.author} onChange={(e) => setBookForm((v) => ({ ...v, author: e.target.value }))} />
              <textarea className="w-full rounded-lg bg-navy-900 border border-white/10 p-3 min-h-28" placeholder="Description" value={bookForm.description} onChange={(e) => setBookForm((v) => ({ ...v, description: e.target.value }))} />
              <select className="w-full rounded-lg bg-navy-900 border border-white/10 p-3" value={bookForm.visibility} onChange={(e) => setBookForm((v) => ({ ...v, visibility: e.target.value as "public" | "private" }))}>
                <option value="public">Public file</option>
                <option value="private">Admin/private file</option>
              </select>
              <label className="block text-sm text-gray-300">Cover image<input className="block w-full mt-1" type="file" accept="image/*" onChange={(e) => setBookForm((v) => ({ ...v, coverFile: e.target.files?.[0] ?? null }))} /></label>
              <label className="block text-sm text-gray-300">Book file<input className="block w-full mt-1" type="file" accept=".pdf,.epub,.mobi" onChange={(e) => setBookForm((v) => ({ ...v, bookFile: e.target.files?.[0] ?? null }))} /></label>
              <label className="flex gap-2 items-center text-sm text-gray-300">
                <input type="checkbox" checked={bookForm.published} onChange={(e) => setBookForm((v) => ({ ...v, published: e.target.checked }))} />
                Published
              </label>
              <button className="rounded-lg bg-electric-500 px-4 py-2 font-semibold">Save Book</button>
            </form>

            <div className="space-y-3">
              {books.map((book) => (
                <div key={book.id} className="bg-navy-800 rounded-xl p-4 border border-white/10 flex flex-col md:flex-row gap-3 md:justify-between">
                  <div>
                    <div className="font-semibold">{book.title}</div>
                    <div className="text-sm text-gray-400">/{book.slug} · {book.author || "No author"}</div>
                    <div className="text-xs mt-1">{book.published ? "Published" : "Draft"} · {book.visibility || "public"}</div>
                  </div>
                  <div className="flex gap-2">
                    {book.coverKey && <button className="border border-white/10 rounded-lg px-3 py-2 text-sm" onClick={() => previewKey(book.coverKey)}>Cover</button>}
                    <button className="border border-white/10 rounded-lg px-3 py-2 text-sm" onClick={() => setBookForm({
                      id: book.id,
                      slug: book.slug,
                      title: book.title,
                      author: book.author || "",
                      description: book.description || "",
                      visibility: (book.visibility || "public") as "public" | "private",
                      published: Boolean(book.published),
                      coverFile: null,
                      bookFile: null,
                    })}>Edit</button>
                    <button className="border border-red-400/30 text-red-300 rounded-lg px-3 py-2 text-sm" onClick={() => deleteBook(book.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[360px_1fr] gap-6">
            <form onSubmit={saveAd} className="bg-navy-800 rounded-xl p-5 space-y-3 h-fit">
              <h2 className="font-bold text-xl">{adForm.id ? "Edit Ad" : "Add Ad"}</h2>
              <input className="w-full rounded-lg bg-navy-900 border border-white/10 p-3" placeholder="Ad name" value={adForm.name} onChange={(e) => setAdForm((v) => ({ ...v, name: e.target.value }))} required />
              <input className="w-full rounded-lg bg-navy-900 border border-white/10 p-3" placeholder="Placement e.g. homepage" value={adForm.placement} onChange={(e) => setAdForm((v) => ({ ...v, placement: e.target.value }))} required />
              <input className="w-full rounded-lg bg-navy-900 border border-white/10 p-3" placeholder="Headline" value={adForm.headline} onChange={(e) => setAdForm((v) => ({ ...v, headline: e.target.value }))} />
              <input className="w-full rounded-lg bg-navy-900 border border-white/10 p-3" placeholder="Link URL" value={adForm.linkUrl} onChange={(e) => setAdForm((v) => ({ ...v, linkUrl: e.target.value }))} />
              <label className="block text-sm text-gray-300">Ad image<input className="block w-full mt-1" type="file" accept="image/*" onChange={(e) => setAdForm((v) => ({ ...v, imageFile: e.target.files?.[0] ?? null }))} /></label>
              <label className="flex gap-2 items-center text-sm text-gray-300">
                <input type="checkbox" checked={adForm.active} onChange={(e) => setAdForm((v) => ({ ...v, active: e.target.checked }))} />
                Active
              </label>
              <button className="rounded-lg bg-electric-500 px-4 py-2 font-semibold">Save Ad</button>
            </form>

            <div className="space-y-3">
              {ads.map((ad) => (
                <div key={ad.id} className="bg-navy-800 rounded-xl p-4 border border-white/10 flex flex-col md:flex-row gap-3 md:justify-between">
                  <div>
                    <div className="font-semibold">{ad.name}</div>
                    <div className="text-sm text-gray-400">{ad.placement} · {ad.headline || "No headline"}</div>
                    <div className="text-xs mt-1">{ad.active ? "Active" : "Inactive"}</div>
                  </div>
                  <div className="flex gap-2">
                    {ad.imageKey && <button className="border border-white/10 rounded-lg px-3 py-2 text-sm" onClick={() => previewKey(ad.imageKey)}>Image</button>}
                    <button className="border border-white/10 rounded-lg px-3 py-2 text-sm" onClick={() => setAdForm({
                      id: ad.id,
                      name: ad.name,
                      placement: ad.placement,
                      headline: ad.headline || "",
                      linkUrl: ad.linkUrl || "",
                      active: Boolean(ad.active),
                      imageFile: null,
                    })}>Edit</button>
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
