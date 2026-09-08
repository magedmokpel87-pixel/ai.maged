"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Lang = "en" | "ar";
type Dict = Record<string, { en: string; ar: string }>;

// قاموس الترجمة — واجهة الموقع الأساسية
export const t: Dict = {
  "nav.home": { en: "Home", ar: "الرئيسية" },
  "nav.tools": { en: "Tools", ar: "الأدوات" },
  "nav.categories": { en: "Categories", ar: "الأقسام" },
  "nav.compare": { en: "Compare", ar: "قارن" },
  "nav.about": { en: "About", ar: "من نحن" },
  "hero.badge": { en: "AI Tools · Marketing · Honest Reviews", ar: "أدوات AI · تسويق · مراجعات صادقة" },
  "hero.title1": { en: "Find the Right", ar: "اكتشف الأداة" },
  "hero.title2": { en: "AI & Marketing", ar: "المناسبة لـ AI والتسويق" },
  "hero.title3": { en: "Tools", ar: "" },
  "hero.sub": { en: "Expert reviews and honest comparisons of the best tools for growing your business. No fluff, no hype — just the information you need to make the right choice.", ar: "مراجعات خبيرة ومقارنات صادقة لأفضل الأدوات لنمو مشروعك. بدون حشو ولا مبالغة — بس المعلومة اللي تحتاجها عشان تختار صح." },
  "hero.cta1": { en: "Explore Tools", ar: "استكشف الأدوات" },
  "hero.cta2": { en: "How We Review", ar: "كيف نراجع" },
  "val.honest.t": { en: "Honest Reviews", ar: "مراجعات صادقة" },
  "val.honest.d": { en: "Real pros and cons. We test tools and report what we find — no sugarcoating.", ar: "مميزات وعيوب حقيقية. نجرّب الأدوات ونقول اللي لقيناه — من غير تجميل." },
  "val.compare.t": { en: "Side-by-Side Comparisons", ar: "مقارنات جنباً إلى جنب" },
  "val.compare.d": { en: "See how tools stack up against each other in clear, structured comparisons.", ar: "شوف الأدوات مقارنة ببعضها في جداول واضحة ومنظمة." },
  "val.save.t": { en: "Save Time & Money", ar: "وفّر وقتك وفلوسك" },
  "val.save.d": { en: "Skip the trial-and-error. Find the right tool for your specific needs faster.", ar: "بلاش تجربة وخطأ. لاقي الأداة المناسبة لاحتياجك بسرعة." },
  "feat.title": { en: "Featured Tools", ar: "أدوات مختارة" },
  "feat.sub": { en: "Hand-picked tools that deliver real value. Each reviewed for features, pricing, and who they work best for.", ar: "أدوات منتقاة بعناية بتقدّم قيمة حقيقية. كل واحدة مراجَعة من حيث المميزات والسعر ولمين تنفع." },
  "cat.title": { en: "Browse by Category", ar: "تصفّح حسب القسم" },
  "cat.sub": { en: "Find tools organized by what they do. Each category has curated recommendations.", ar: "لاقي الأدوات مرتّبة حسب وظيفتها. كل قسم فيه ترشيحات مختارة." },
  "cta.title": { en: "Ready to Find Your Perfect Tool?", ar: "جاهز تلاقي أداتك المثالية؟" },
  "cta.sub": { en: "Stop wasting time on tools that don't fit. Browse our curated reviews and make an informed decision.", ar: "بطّل تضيّع وقت في أدوات مش مناسبة. تصفّح مراجعاتنا المختارة واتخذ قرار مدروس." },
  "cta.btn": { en: "Start Exploring", ar: "ابدأ الاستكشاف" },
  "footer.tagline": { en: "Helping you find the right AI and marketing tools. We research, compare, and review so you can make informed decisions. Some links on this site are affiliate links.", ar: "بنساعدك تلاقي أدوات AI والتسويق المناسبة. نبحث ونقارن ونراجع عشان تاخد قرارات مدروسة. بعض الروابط في الموقع روابط تسويق بالعمولة." },
  "footer.categories": { en: "Categories", ar: "الأقسام" },
  "footer.rights": { en: "All rights reserved.", ar: "كل الحقوق محفوظة." },
  "footer.resources": { en: "Resources", ar: "روابط" },
  "footer.allTools": { en: "All Tools", ar: "كل الأدوات" },
  "footer.comparisons": { en: "Comparisons", ar: "المقارنات" },
  "footer.aboutUs": { en: "About Us", ar: "من نحن" },
  "footer.privacy": { en: "Privacy Policy", ar: "سياسة الخصوصية" },
  "footer.terms": { en: "Terms of Service", ar: "شروط الخدمة" },
  "footer.affiliate": { en: "Affiliate Disclosure", ar: "إفصاح العمولة" },
  "footer.contact": { en: "Contact", ar: "تواصل معنا" },
  "footer.affiliateNote": { en: "Affiliate Disclosure: Some links on this site are affiliate links. We may earn a commission at no extra cost to you.", ar: "إفصاح العمولة: بعض الروابط في الموقع روابط تسويق بالعمولة. قد نحصل على عمولة بدون أي تكلفة إضافية عليك." },
};

interface LangCtx { lang: Lang; setLang: (l: Lang) => void; tr: (k: string) => string; dir: "rtl" | "ltr"; }
const LanguageContext = createContext<LangCtx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("lang")) as Lang | null;
    if (saved === "ar" || saved === "en") setLangState(saved);
  }, []);

  useEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    if (typeof window !== "undefined") localStorage.setItem("lang", lang);
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);
  const tr = (k: string) => (t[k] ? t[k][lang] : k);
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ lang, setLang, tr, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
