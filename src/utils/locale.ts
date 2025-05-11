/* tiny helper for language switching + translations */

/* the two flat JSON files you created earlier */
import en from '@/locales/en/common.json';
import ar from '@/locales/ar/common.json';

export const dict = { en, ar };

export const isArabicPath = (path: string): boolean =>
  path === '/ar' || path.startsWith('/ar/');

export const toggleLocalePath = (path: string): string => {
  /* strip query/hash – we only care about the pathname here */
  const [pathname, search = ''] = path.split('?');

  if (isArabicPath(pathname)) {
    /* /ar         → /       */
    /* /ar/contact → /contact */
    const dest =
      pathname === '/ar' ? '/' : pathname.replace(/^\/ar/, '') || '/';
    return dest + (search ? '?' + search : '');
  }

  /* /contact → /ar/contact   |   / → /ar */
  const dest = pathname === '/' ? '/ar' : `/ar${pathname}`;
  return dest + (search ? '?' + search : '');
};

/* very small “t()” utility – dot-notation keys allowed */
export const t = (locale: string, key: string): string => {
  const parts = key.split('.');
  let out: any = dict[locale as 'en' | 'ar'] ?? dict.en;
  for (const p of parts) out = out?.[p];
  return typeof out === 'string' ? out : key; // fallback to key if missing
};
