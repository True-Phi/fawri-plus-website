/* ------------------------------------------------------------------ */
/* src/components/atoms/LanguageSwitcher/index.tsx                    */
/* ------------------------------------------------------------------ */
import Link from 'next/link';               // ← use Next’s Link, not the atom
import { useRouter } from 'next/router';
import { toggleLocalePath } from '@/utils/locale';

export default function LanguageSwitcher() {
  const router     = useRouter();
  const isArabic   = router.locale === 'ar';
  const targetHref = toggleLocalePath(router.asPath);   // "/contact" → "/ar/contact" (and back)
  const label      = isArabic ? 'English' : 'العربية';

  return (
    <Link href={targetHref} className="inline-flex items-center text-sm">
      {label}
    </Link>
  );
}
