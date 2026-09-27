"use client";

import Link from "next/link";
import Image from "next/image";
import { categories } from "@/data/categories";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function Footer() {
  const { tr } = useLanguage();
  return (
    <footer className="bg-navy-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
              <Image src="/logo.png" alt="AI.MAGED" width={40} height={40} className="h-9 w-auto" />
              <span className="text-2xl font-bold text-electric-500">AI</span>
              <span className="text-2xl font-bold text-white">.MAGED</span>
            </div>
            <p className="text-sm max-w-md">
              {tr("footer.tagline")}
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-3">{tr("footer.categories")}</h3>
            <ul className="space-y-2 text-sm">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/category/${cat.slug}`} className="hover:text-white transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-3">{tr("footer.resources")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/books" className="hover:text-white transition-colors">
                  {tr("footer.allTools")}
                </Link>
              </li>
              <li>
                <Link href="/books" className="hover:text-white transition-colors">
                  {tr("footer.comparisons")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  {tr("footer.aboutUs")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  {tr("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  {tr("footer.terms")}
                </Link>
              </li>
              <li>
                <Link href="/affiliate-disclosure" className="hover:text-white transition-colors">
                  {tr("footer.affiliate")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  {tr("footer.contact")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} AI.MAGED. {tr("footer.rights")}</p>
          <p className="mt-1 text-xs text-gray-500">
            {tr("footer.affiliateNote")}
          </p>
        </div>
      </div>
    </footer>
  );
}
