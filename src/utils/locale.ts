/* ------------------------------------------------------------------ */
/*  src/utils/locale.ts                                               */
/* ------------------------------------------------------------------ */
/*  Tiny i18n helper:                                                  */
/*    • detects “/ar …” routes                                          */
/*    • toggles EN ↔ AR pathname                                        */
/*    • dictionary-lookup helper “t()”                                  */
/* ------------------------------------------------------------------ */

import en from '../locales/en/common.json';
import ar from '../locales/ar/common.json';

export const dict = { en, ar } as const;

/* ───────────── detect Arabic route ───────────── */
export function isArabicPath(path: string): boolean {
  return path === '/ar' || path.startsWith('/ar/');
}

/* ─────── toggle /…  ↔  /ar/… keeping query/hash ─────── */
export function toggleLocalePath(path: string): string {
  const [pathname, search = ''] = path.split('?');
  const query = search ? `?${search}` : '';

  if (isArabicPath(pathname)) {
    //  /ar          → /
    //  /ar/contact  → /contact
    const dest =
      pathname === '/ar' ? '/' : pathname.replace(/^\/ar/, '') || '/';
    return dest + query;
  }

  //  /           → /ar
  //  /contact    → /ar/contact
  const dest = pathname === '/' ? '/ar' : `/ar${pathname}`;
  return dest + query;
}

/* ─────────── super-simple dictionary lookup ─────────── */
export function t(locale: string | undefined, key: string): string {
  const lang = locale === 'ar' ? 'ar' : 'en';
  const dotted = key.split('.');
  let out: any = dict[lang];
  for (const p of dotted) out = out?.[p];
  return typeof out === 'string' ? out : key; // fallback = key itself
}
