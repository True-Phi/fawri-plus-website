import '../css/main.css';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

// helper that knows /ar vs. English
import { isArabicPath } from '../utils/locale';

export default function MyApp({ Component, pageProps }) {
    const router = useRouter();

    // We still set <html lang> so SEO/accessibility can see Arabic,
    // but we *always* keep dir="ltr".
    document.documentElement.lang = isArabicPath(router.asPath) ? 'ar' : 'en';
    document.documentElement.dir  = 'ltr';
  }, [router.asPath]);

    return <Component {...pageProps} />;
}
