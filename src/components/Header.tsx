"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import LanguageToggle from "@/components/LanguageToggle";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { tr } = useLanguage();

  return (
    <header className="bg-navy-900 text-white sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse">
            <Image src="/logo.png" alt="AI.MAGED" width={40} height={40} className="h-9 w-auto" priority />
            <span className="text-2xl font-bold text-electric-500">AI</span>
            <span className="text-2xl font-bold text-white">.MAGED</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
            <Link href="/books" className="text-gray-300 hover:text-white transition-colors">Books</Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
            <LanguageToggle />
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <LanguageToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-white/5">
            <Link href="/" className="block py-2 text-gray-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/books" className="block py-2 text-gray-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Books</Link>
            <Link href="/about" className="block py-2 text-gray-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link href="/contact" className="block py-2 text-gray-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
          </div>
        )}
      </nav>
    </header>
  );
}
