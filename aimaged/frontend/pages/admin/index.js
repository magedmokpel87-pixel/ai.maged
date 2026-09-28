import { useEffect, useState } from 'react';
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
    <AdminLayout title="لوحة التحكم / Dashboard">
      <div className="stat-row">
        <div className="stat-card"><b>{stats.books}</b><span>كتب / Books</span></div>
        <div className="stat-card"><b>{stats.ads}</b><span>إعلانات / Ads</span></div>
        <div className="stat-card"><b>{stats.orders}</b><span>طلبات / Orders</span></div>
      </div>
      <p>كل التعديلات من هذه اللوحة تظهر مباشرة على الموقع بدون تعديل كود.</p>
    </AdminLayout>
  );
}
