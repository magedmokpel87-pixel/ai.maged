"use client";

import Link from "next/link";
import { useState } from "react";
import { categories } from "@/data/categories";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  return (
    <header className="bg-navy-900 text-white sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-electric-500">MOTION</span>
            <span className="text-2xl font-bold text-white">.X</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/tools" className="text-gray-300 hover:text-white transition-colors">
              Tools
            </Link>
            <div className="relative">
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1"
              >
                <span>Categories</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {categoriesOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-electric-500 transition-colors"
                      onClick={() => setCategoriesOpen(false)}
                    >
                      <span className="mr-2">{cat.icon}</span>
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link href="/compare" className="text-gray-300 hover:text-white transition-colors">
              Compare
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
              About
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <Link href="/" className="block py-2 text-gray-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <div className="py-2">
              <p className="text-gray-500 text-sm uppercase tracking-wider mb-1">Categories</p>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="block py-1 pl-4 text-gray-300 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {cat.icon} {cat.name}
                </Link>
              ))}
            </div>
            <Link href="/tools" className="block py-2 text-gray-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
              Tools
            </Link>
            <Link href="/compare" className="block py-2 text-gray-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
              Compare
            </Link>
            <Link href="/about" className="block py-2 text-gray-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
              About
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
