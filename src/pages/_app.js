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

  useEffect(() => {
    // Track Meta Pixel PageView on route change (client-side)
    const handleRouteChange = () => {
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'PageView');
      }
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return <Component {...pageProps} />;
}
