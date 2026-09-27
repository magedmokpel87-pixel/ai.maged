"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Lang = "en" | "ar";
type Dict = Record<string, { en: string; ar: string }>;

export const t: Dict = {
  "nav.home": { en: "Home", ar: "الرئيسية" },
  "nav.books": { en: "Books", ar: "الكتب" },
  "nav.about": { en: "About", ar: "من نحن" },
  "nav.contact": { en: "Contact", ar: "تواصل معنا" },
  "hero.badge": { en: "Curated Books • Selected Intentionally", ar: "كتب مختارة • بعناية وقصد" },
  "hero.title1": { en: "Books worth your", ar: "كتب تستحق" },
  "hero.title2": { en: "time", ar: "وقتك" },
  "hero.title3": { en: ".", ar: "." },
  "hero.sub": { en: "A clean library of carefully selected titles. No random uploads, no clutter — just the books chosen to be here.", ar: "مكتبة بسيطة تضم عناوين مختارة بعناية. لا رفع عشوائي ولا زحام — فقط الكتب التي تم اختيارها لتكون هنا." },
  "hero.cta1": { en: "Browse Books", ar: "تصفح الكتب" },
  "hero.cta2": { en: "About AI.MAGED", ar: "عن AI.MAGED" },
  "val.honest.t": { en: "Curated", ar: "مختارة" },
  "val.honest.d": { en: "Only titles intentionally selected and published by the site owner appear in the library.", ar: "تظهر فقط العناوين التي يختارها مالك الموقع وينشرها بنفسه." },
  "val.compare.t": { en: "Simple", ar: "بسيطة" },
  "val.compare.d": { en: "A focused reading experience without unnecessary features or clutter.", ar: "تجربة مركزة على الكتب بدون ميزات أو زحام غير ضروري." },
  "val.save.t": { en: "Built to Grow", ar: "جاهزة للتوسع" },
  "val.save.d": { en: "More book types and, later, courses can be added without rebuilding the foundation.", ar: "يمكن إضافة أنواع كتب أكثر، ثم الكورسات لاحقًا، بدون إعادة بناء الأساس." },
  "feat.title": { en: "Featured Books", ar: "كتب مختارة" },
  "feat.sub": { en: "Selected titles from the AI.MAGED library.", ar: "عناوين مختارة من مكتبة AI.MAGED." },
  "cat.title": { en: "Browse by Subject", ar: "تصفح حسب الموضوع" },
  "cat.sub": { en: "Explore books by the category assigned to each title.", ar: "استكشف الكتب حسب القسم المحدد لكل عنوان." },
  "cta.title": { en: "Find your next book.", ar: "اعثر على كتابك القادم." },
  "cta.sub": { en: "Open the library and explore the titles currently published on AI.MAGED.", ar: "افتح المكتبة واستكشف العناوين المنشورة حاليًا على AI.MAGED." },
  "cta.btn": { en: "Explore Books", ar: "استكشف الكتب" },
  "footer.tagline": { en: "A focused library of carefully selected books. Some links may be affiliate links.", ar: "مكتبة مركزة تضم كتبًا مختارة بعناية. قد تكون بعض الروابط روابط تسويق بالعمولة." },
  "footer.categories": { en: "Library", ar: "المكتبة" },
  "footer.rights": { en: "All rights reserved.", ar: "كل الحقوق محفوظة." },
  "footer.resources": { en: "Resources", ar: "روابط" },
  "footer.allTools": { en: "All Books", ar: "كل الكتب" },
  "footer.comparisons": { en: "Books", ar: "الكتب" },
  "footer.aboutUs": { en: "About Us", ar: "من نحن" },
  "footer.privacy": { en: "Privacy Policy", ar: "سياسة الخصوصية" },
  "footer.terms": { en: "Terms of Service", ar: "شروط الخدمة" },
  "footer.affiliate": { en: "Affiliate Disclosure", ar: "إفصاح العمولة" },
  "footer.contact": { en: "Contact", ar: "تواصل معنا" },
  "footer.affiliateNote": { en: "Some links on this site may be affiliate links. Any qualifying commission does not increase your cost.", ar: "قد تكون بعض الروابط في الموقع روابط تسويق بالعمولة. أي عمولة مؤهلة لا تزيد التكلفة عليك." },
};

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  tr: (k: string) => string;
  dir: "rtl" | "ltr";
}

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

  return <LanguageContext.Provider value={{ lang, setLang, tr, dir }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
