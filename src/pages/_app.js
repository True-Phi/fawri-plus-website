import '../css/main.css';
import { IntlProvider } from 'react-intl';
import en from '../public/locales/en.json';
import ar from '../public/locales/ar.json';
import { useLocale } from '../src/hooks/useLocale';

export default function MyApp({ Component, pageProps }) {
  const locale = useLocale();
  const messages = locale === 'ar' ? ar : en;
  return (
    <div dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <IntlProvider locale={locale} messages={messages}>
        <Component {...pageProps} />
      </IntlProvider>
    </div>
  );
}
