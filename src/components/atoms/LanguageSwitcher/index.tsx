import { useRouter } from 'next/router';
import { toggleLocalePath, isArabicPath } from '../../../utils/locale';

export default function LanguageSwitcher() {
  const router = useRouter();
  const arabic = isArabicPath(router.asPath);

  const handleClick = () => {
    router.push(toggleLocalePath(router.asPath), undefined, { locale: false });
  };

  return (
    <button
      className="px-3 py-1 text-sm font-semibold hover:underline"
      onClick={handleClick}
      aria-label={arabic ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      {arabic ? 'EN' : 'ع'}
    </button>
  );
}
