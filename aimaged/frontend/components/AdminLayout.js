import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getToken, decodeRole, clearToken } from '../lib/api';

const LINKS = [
  { href: '/admin', label: 'نظرة عامة', en: 'Overview', icon: '◧' },
  { href: '/admin/books', label: 'الكتب', en: 'Books', icon: '▤' },
  { href: '/admin/ads', label: 'الإعلانات', en: 'Ads', icon: '◈' },
  { href: '/admin/pages', label: 'محتوى الصفحات', en: 'Content', icon: '✎' },
  { href: '/admin/settings', label: 'الإعدادات', en: 'Settings', icon: '⚙' },
];

export default function AdminLayout({ children, title }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token || decodeRole(token) !== 'admin') {
      router.replace('/admin/login');
    } else {
      setReady(true);
    }
  }, [router]);

  if (typeof window === 'undefined') return null;
  const token = getToken();
  if (!token || decodeRole(token) !== 'admin' || !ready) return null;

  const email = (() => {
    try {
      return JSON.parse(atob(token.split('.')[1])).email;
    } catch {
      return '';
    }
  })();

  const isActive = (href) =>
    href === '/admin' ? router.pathname === '/admin' : router.pathname.startsWith(href);

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <Link href="/admin" className="admin-brand">
          <img src="/logo-mark.png" alt="AI.MAGED" width={40} height={40} />
          <span>
            <b>AI.MAGED</b>
            <i>لوحة التحكم</i>
          </span>
        </Link>
        <nav className="admin-nav">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={`admin-nav-link${isActive(l.href) ? ' active' : ''}`}>
              <span className="ico">{l.icon}</span>
              <span className="lbl">{l.label}</span>
              <span className="en">{l.en}</span>
            </Link>
          ))}
        </nav>
        <a href="/" target="_blank" rel="noreferrer" className="admin-site-link">↗ فتح الموقع / View Site</a>
        <div className="admin-side-foot">
          <span className="admin-user" title={email}>{email}</span>
          <button
            className="admin-logout"
            onClick={() => {
              clearToken();
              router.push('/admin/login');
            }}
          >
            خروج / Logout
          </button>
        </div>
      </aside>
      <div className="admin-body">
        <header className="admin-topbar">
          <h1 className="admin-title">{title}</h1>
        </header>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
