// src/components/LanguageSwitcher.tsx
"use client"; // Required for Next.js App Router (if you're using it)

import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // Set RTL for Arabic
    if (lng === "ar") {
      document.body.setAttribute("dir", "rtl");
    } else {
      document.body.setAttribute("dir", "ltr");
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => changeLanguage("en")}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        English
      </button>
      <button
        onClick={() => changeLanguage("ar")}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        العربية
      </button>
    </div>
  );
};

export default LanguageSwitcher;
