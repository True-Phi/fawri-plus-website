// hooks/useLocale.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export function useLocale() {
  const { query } = useRouter();
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    const q = typeof query.lang === 'string' ? query.lang : null;
    if (q === 'ar' || q === 'en') setLocale(q);
    else if (navigator.language.startsWith('ar')) setLocale('ar');
    else setLocale('en');
  }, [query.lang]);

  return locale;
}
