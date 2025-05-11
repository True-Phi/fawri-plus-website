import '../css/main.css';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { isArabicPath } from '../utils/locale';

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  /* tag <html> with the right lang attribute (SEO) */
  useEffect(() => {
    document.documentElement.lang = isArabicPath(router.asPath) ? 'ar' : 'en';
    document.documentElement.dir  = 'ltr';        // we stay LTR
  }, [router.asPath]);

  return <Component {...pageProps} />;
}
