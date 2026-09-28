import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getToken, decodeRole, clearToken } from '../lib/api';

const LINKS = [
  { href: '/admin', label: 'الرئيسية / Overview' },
  { href: '/admin/books', label: 'الكتب / Books' },
  { href: '/admin/ads', label: 'الإعلانات / Ads' },
  { href: '/admin/pages', label: 'محتوى الصفحات / Content' },
];

export default function AdminLayout({ children, title }) {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token || decodeRole(token) !== 'admin') {
      router.replace('/admin/login');
    }
  }, [router]);

  if (typeof window === 'undefined') return null;
  const token = getToken();
  if (!token || decodeRole(token) !== 'admin') return null;

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="admin-brand">AI.MAGED — لوحة التحكم</div>
        <nav>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="admin-nav-link">{l.label}</Link>
          ))}
          <Link href="/" className="admin-nav-link">↗ الموقع / Site</Link>
        </nav>
        <button
          className="admin-logout"
          onClick={() => {
            clearToken();
            router.push('/admin/login');
          }}
        >
          خروج / Logout
        </button>
      </aside>
      <main className="admin-main">
        {title && <h1 className="admin-title">{title}</h1>}
        {children}
      </main>
    </div>
  );
}
