/* ------------------------------------------------------------------ */
/*  src/utils/locale.ts                                               */
/*  — single responsibility: give me a translated string              */
/* ------------------------------------------------------------------ */

import en from '../locales/en/common.json';
import ar from '../locales/ar/common.json';

export type Locale = 'en' | 'ar';

/** all dictionaries in one place */
const DICT: Record<Locale, typeof en> = { en, ar };

/**
 * Simple utility → `t(locale, 'logo')`
 *
 * If the key is missing in the requested locale we silently fall back
 * to the English entry, and finally to the key itself.
 */
export function t<K extends keyof typeof en>(
  locale: string | undefined,
  key: K
): (typeof en)[K] {
  const dict = DICT[(locale as Locale) || 'en'] ?? DICT.en;
  return (dict[key] ?? DICT.en[key] ?? (key as unknown)) as (typeof en)[K];
}
