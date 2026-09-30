import { useRouter } from 'next/router';
import Head from 'next/head';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  const { locale } = useRouter();
  const dir = locale === 'en' ? 'ltr' : 'rtl';

  return (
    <div dir={dir} lang={locale}>
      <Head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/logo-mark.png" />
      </Head>
      <Component {...pageProps} />
    </div>
  );
}
