// src/pages/_app.js
import "../i18n"; // Import i18n to initialize it
import LanguageSwitcher from "../components/LanguageSwitcher";
import "../css/main.css"; // Keep your existing global CSS

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <LanguageSwitcher />
      <Component {...pageProps} />
    </>
  );
}
