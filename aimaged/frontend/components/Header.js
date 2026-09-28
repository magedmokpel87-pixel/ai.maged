import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getToken, decodeRole } from '../lib/api';
import ar from '../locales/ar.json';
import en from '../locales/en.json';

export default function Header() {
  const router = useRouter();
  const t = router.locale === 'en' ? en : ar;
  const otherLocale = router.locale === 'en' ? 'ar' : 'en';
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const tok = getToken();
    setAdmin(!!tok && decodeRole(tok) === 'admin');
  }, [router.asPath]);

  return (
    <header className="header">
      <Link href="/" className="logo">AI.MAGED</Link>
      <input type="search" placeholder={t.search_placeholder} />
      <nav>
        {admin && <Link href="/admin" className="button admin-link">لوحة التحكم</Link>}
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
