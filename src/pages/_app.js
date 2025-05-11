// src/pages/_app.js
import "../i18n";
import LanguageSwitcher from "../components/LanguageSwitcher";
import "../css/main.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <LanguageSwitcher />
      <Component {...pageProps} />
    </>
  );
}
