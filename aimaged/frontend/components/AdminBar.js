import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getToken, decodeRole } from '../lib/api';

export default function AdminBar({ pageKey }) {
  const [admin, setAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const t = getToken();
    setAdmin(!!t && decodeRole(t) === 'admin');
  }, [router.asPath]);

  if (!admin) return null;

  return (
    <div className="admin-bar">
      <span className="tag">وضع المدير / Admin</span>
      {pageKey && <Link href={`/admin/pages?key=${pageKey}&locale=${router.locale || 'ar'}`}>✎ تعديل نصوص هذه الصفحة</Link>}
      <Link href="/admin/books">الكتب</Link>
      <Link href="/admin/ads">الإعلانات</Link>
      <Link href="/admin">لوحة التحكم</Link>
    </div>
  );
}
