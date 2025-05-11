import Link from 'next/link';
import { useRouter } from 'next/router';
import { isArabicPath, toggleLocalePath } from '../../../utils/locale';

export default function LanguageSwitcher() {
  const router  = useRouter();
  const arabic  = isArabicPath(router.asPath);
  const nextUrl = toggleLocalePath(router.asPath);

  return (
    <Link href={nextUrl} className="inline-flex items-center text-sm">
      {arabic ? 'English' : 'العربية'}
    </Link>
  );
}
