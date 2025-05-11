import '../css/main.css';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { isArabicPath } from '../utils/locale';

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Keep LTR but still tag Arabic pages for SEO
    document.documentElement.lang = isArabicPath(router.asPath) ? 'ar' : 'en';
    document.documentElement.dir  = 'ltr';
  }, [router.asPath]);

  return <Component {...pageProps} />;
}
