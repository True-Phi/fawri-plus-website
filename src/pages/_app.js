import '../css/main.css';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../components/sections/Header';
import Footer from '../components/sections/Footer';

export default function MyApp({ Component, pageProps }) {
  const { locale } = useRouter();

  return (
    <>
      <Head>
        {/* inform search engines and browsers */}
        <meta httpEquiv="Content-Language" content={locale} />
      </Head>
      {/* wrap to set reading direction */}
      <div lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        {/* locale‐specific header/footer */}
        <Header {...pageProps.header} />
        <Component {...pageProps} />
        <Footer {...pageProps.footer} />
      </div>
    </>
  );
}
