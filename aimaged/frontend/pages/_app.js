import { useRouter } from 'next/router';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  const { locale } = useRouter();
  const dir = locale === 'en' ? 'ltr' : 'rtl';

  return (
    <div dir={dir} lang={locale}>
      <Component {...pageProps} />
    </div>
  );
}
