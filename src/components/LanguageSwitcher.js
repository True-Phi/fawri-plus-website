// src/components/LanguageSwitcher.js
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const router = useRouter();
  const currentLanguage = i18n.language || "en";

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === "en" ? "ar" : "en";
    i18n.changeLanguage(newLanguage);
    // Set RTL for Arabic, but keep header/footer LTR (handled in CSS)
    if (newLanguage === "ar") {
      document.body.setAttribute("dir", "rtl");
      router.push("/ar");
    } else {
      document.body.setAttribute("dir", "ltr");
      router.push("/");
    }
  };

  // Update document direction on initial load
  useEffect(() => {
    if (router.pathname.startsWith("/ar")) {
      i18n.changeLanguage("ar");
      document.body.setAttribute("dir", "rtl");
    } else {
      i18n.changeLanguage("en");
      document.body.setAttribute("dir", "ltr");
    }
  }, [i18n, router.pathname]);

  return (
    <button
      onClick={toggleLanguage}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      {t(currentLanguage === "en" ? "switchToArabic" : "switchToEnglish")}
    </button>
  );
};

export default LanguageSwitcher;
