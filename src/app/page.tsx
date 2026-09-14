"use client";

import { products } from "@/data/products";
import { categories } from "@/data/categories";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import CTAButton from "@/components/CTAButton";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function Home() {
  const featuredProducts = products.slice(0, 3);
  const { tr } = useLanguage();

  return (
    <>
      {/* Ambient backgrounds */}
      <div className="mesh"></div>
      <div className="grain"></div>

      {/* Hero Section */}
      <section className="relative bg-void text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-gold-bright border border-gold/35 bg-gold/6 px-3 py-1.5 rounded-full mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              {tr("hero.badge")}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 font-display">
              {tr("hero.title1")}{" "}
              <span className="text-electric-500">{tr("hero.title2")}</span>{" "}
              {tr("hero.title3")}
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-8">
              {tr("hero.sub")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton href="#featured" text={tr("hero.cta1")} size="lg" />
              <CTAButton href="/about" text={tr("hero.cta2")} variant="outline" size="lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 bg-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-electric-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-electric-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{tr("val.honest.t")}</h3>
              <p className="text-gray-400 text-sm">{tr("val.honest.d")}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-electric-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-electric-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{tr("val.compare.t")}</h3>
              <p className="text-gray-400 text-sm">{tr("val.compare.d")}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-electric-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-electric-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{tr("val.save.t")}</h3>
              <p className="text-gray-400 text-sm">{tr("val.save.d")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured" className="py-16 bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">{tr("feat.title")}</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {tr("feat.sub")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">{tr("cat.title")}</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {tr("cat.sub")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">{tr("cta.title")}</h2>
          <p className="text-gray-300 mb-8 text-lg">
            {tr("cta.sub")}
          </p>
          <CTAButton href="/category/all-in-one-marketing" text={tr("cta.btn")} size="lg" />
        </div>
      </section>
    </>
  );
}
