"use client";

import { useLanguage } from "@/i18n/LanguageProvider";

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <button
      onClick={() => setLang(lang === "en" ? "ar" : "en")}
      className="text-gray-300 hover:text-white transition-colors border border-gray-600 rounded-full px-3 py-1 text-sm font-medium"
      aria-label="Switch language"
    >
      {lang === "en" ? "🇪🇬 العربية" : "🇬🇧 English"}
    </button>
  );
}
