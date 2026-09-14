import Link from 'next/link';
import { useRouter } from 'next/router';
import ar from '../locales/ar.json';
import en from '../locales/en.json';

export default function Header() {
  const router = useRouter();
  const t = router.locale === 'en' ? en : ar;
  const otherLocale = router.locale === 'en' ? 'ar' : 'en';

  return (
    <header className="header">
      <Link href="/" className="logo">AI.MAGED</Link>
      <input type="search" placeholder={t.search_placeholder} />
      <nav>
        <Link href="/cart" className="button">{t.cart}</Link>
        <button onClick={() => (window.location.href = '/api/auth/oauth/google')}>
          {t.login_with_google}
        </button>
        <button onClick={() => (window.location.href = '/api/auth/oauth/facebook')}>
          {t.login_with_facebook}
        </button>
        <Link href={router.asPath} locale={otherLocale} className="button">
          {otherLocale.toUpperCase()}
        </Link>
      </nav>
    </header>
  );
}
