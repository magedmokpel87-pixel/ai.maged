import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { api } from '../../lib/api';

export default function AdminPages() {
  const [key, setKey] = useState('home');
  const [locale, setLocale] = useState('ar');
  const [title, setTitle] = useState('');
  const [rows, setRows] = useState([]);
  const [msg, setMsg] = useState('');
  const [loaded, setLoaded] = useState(false);

  async function loadPage() {
    setLoaded(false);
    try {
      const r = await api.get(`/api/pages/${key}`, { params: { locale } });
      setTitle(r.data.title);
      setRows(Object.entries(r.data.body || {}).map(([k, v]) => ({ k, v })));
    } catch {
      setTitle(key === 'home' ? 'الرئيسية' : key);
      setRows([]);
    }
    setLoaded(true);
  }
  useEffect(() => { loadPage(); }, [key, locale]);

  function setRow(i, field, val) {
    setRows((rs) => rs.map((r, x) => (x === i ? { ...r, [field]: val } : r)));
  }

  async function save(e) {
    e.preventDefault();
    const body = {};
    rows.forEach((r) => { if (r.k) body[r.k] = r.v; });
    try {
      await api.put(`/api/pages/${key}`, { title, locale, body });
      setMsg('تم الحفظ ✓ — التحديث مباشر على الموقع');
    } catch (err) {
      setMsg('خطأ: ' + (err.response?.data?.error || ''));
    }
  }

  return (
    <AdminLayout title="محتوى الصفحات / Page Content">
      <div className="row" style={{ maxWidth: 480 }}>
        <div style={{ flex: 1 }}>
          <label>معرّف الصفحة / Page key</label>
          <input value={key} onChange={(e) => setKey(e.target.value)} placeholder="home | about | footer" />
        </div>
        <div style={{ flex: 1 }}>
          <label>اللغة / Locale</label>
          <select value={locale} onChange={(e) => setLocale(e.target.value)}>
            <option value="ar">عربي</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
      <form className="admin-form" onSubmit={save}>
        <label>عنوان الصفحة / Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        <label>الأقسام / Sections (مفتاح ← نص)</label>
        {loaded && rows.map((r, i) => (
          <div className="row" key={i}>
            <div style={{ flex: 1 }}><input value={r.k} placeholder="hero_title" onChange={(e) => setRow(i, 'k', e.target.value)} /></div>
            <div style={{ flex: 2 }}><input value={r.v} placeholder="النص..." onChange={(e) => setRow(i, 'v', e.target.value)} /></div>
            <button type="button" className="ghost" onClick={() => setRows((rs) => rs.filter((_, x) => x !== i))}>✕</button>
          </div>
        ))}
        <div className="actions">
          <button type="button" className="ghost" onClick={() => setRows((rs) => [...rs, { k: '', v: '' }])}>+ قسم جديد</button>
          <button type="submit">حفظ / Save</button>
          {msg && <span className="msg">{msg}</span>}
        </div>
      </form>
    </AdminLayout>
  );
}
