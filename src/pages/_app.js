import '../css/main.css';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

// helper that knows /ar vs. English
import { isArabicPath } from '../utils/locale';

export default function MyApp({ Component, pageProps }) {
    const router = useRouter();

    // Whenever the route changes, update <html lang dir="">
    useEffect(() => {
        const arabic = isArabicPath(router.asPath);
        document.documentElement.lang = arabic ? 'ar' : 'en';
        document.documentElement.dir = arabic ? 'rtl' : 'ltr';
    }, [router.asPath]);

    return <Component {...pageProps} />;
}
