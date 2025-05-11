import { useRouter } from 'next/router';

export default function LanguageSwitcher() {
  const router = useRouter();
  const other = router.locale === 'ar' ? 'en' : 'ar';

  return (
    <Link
      href={router.asPath}
      locale={other}
      className="inline-flex items-center text-sm"
    >
      {other === 'ar' ? 'العربية' : 'English'}
    </Link>
  );
}
