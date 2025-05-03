// components/LanguageSwitcher.js
import { useRouter } from 'next/router';

export default function LanguageSwitcher() {
  const { asPath, pathname, query, push } = useRouter();
  const switchTo = (lang) =>
    push({ pathname, query: { ...query, lang } }, asPath, { shallow: true });

  return (
    <div>
      <button onClick={() => switchTo('en')}>EN</button>
      <button onClick={() => switchTo('ar')}>AR</button>
    </div>
  );
}
