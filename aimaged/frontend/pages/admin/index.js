import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '../../components/AdminLayout';
import { api } from '../../lib/api';

export default function AdminHome() {
  const [stats, setStats] = useState({ books: 0, ads: 0, orders: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/api/products/all').catch(() => ({ data: [] })),
      api.get('/api/ads/all').catch(() => ({ data: [] })),
    ]).then(([books, ads]) => {
      setStats({ books: books.data.length, ads: ads.data.length, orders: 0 });
    });
  }, []);

  return (
    <AdminLayout title="نظرة عامة / Overview">
      <div className="stat-row">
        <div className="stat-card"><b>{stats.books}</b><span>كتب / Books</span></div>
        <div className="stat-card"><b>{stats.ads}</b><span>إعلانات / Ads</span></div>
        <div className="stat-card"><b>{stats.orders}</b><span>طلبات / Orders</span></div>
      </div>
      <h2 className="quick-title">إجراءات سريعة</h2>
      <div className="stat-row">
        <Link href="/admin/books" className="stat-card quick">＋ إضافة كتاب</Link>
        <Link href="/admin/ads" className="stat-card quick">＋ إضافة إعلان</Link>
        <Link href="/admin/pages?key=home&locale=ar" className="stat-card quick">✎ تعديل نصوص الرئيسية</Link>
        <Link href="/admin/settings" className="stat-card quick">⚙ تغيير كلمة السر</Link>
        <a href="/" target="_blank" rel="noreferrer" className="stat-card quick">↗ معاينة الموقع</a>
      </div>
      <div className="admin-card">
        <h2>كيف تعمل اللوحة؟</h2>
        <p className="muted">كل التعديلات من هذه اللوحة تظهر مباشرة على الموقع بدون تعديل كود. وعند دخولك للموقع بنفس المتصفح وأنت مدير، تظهر لك شريط «وضع المدير» أسفل الموقع فيه زر تعديل مباشر لنصوص أي صفحة.</p>
      </div>
    </AdminLayout>
  );
}
