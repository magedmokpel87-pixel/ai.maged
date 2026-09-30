import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { api, absUrl } from '../../lib/api';

const EMPTY = {
  titleAr: '', titleEn: '', bodyAr: '', bodyEn: '',
  imageUrl: '', linkUrl: '', placement: 'home_top', sortOrder: 0, active: true,
};

export default function AdminAds() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState('');

  const load = () => api.get('/api/ads/all').then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function uploadImg(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    try {
      const r = await api.post('/api/uploads', fd);
      set('imageUrl', r.data.url);
    } catch { setMsg('فشل الرفع'); }
  }

  async function save(e) {
    e.preventDefault();
    const payload = { ...form, imageUrl: form.imageUrl || null, linkUrl: form.linkUrl || null, sortOrder: Number(form.sortOrder) };
    try {
      if (editingId) await api.put(`/api/ads/${editingId}`, payload);
      else await api.post('/api/ads', payload);
      setMsg('تم الحفظ ✓'); reset(); load();
    } catch (err) { setMsg('خطأ: ' + (err.response?.data?.error || '')); }
  }

  function reset() { setEditingId(null); setForm(EMPTY); }
  function edit(a) {
    setEditingId(a.id);
    setForm({ ...EMPTY, ...a, sortOrder: a.sortOrder, imageUrl: a.imageUrl || '', linkUrl: a.linkUrl || '' });
  }
  async function toggle(a) { await api.put(`/api/ads/${a.id}`, { active: !a.active }); load(); }
  async function remove(a) { await api.delete(`/api/ads/${a.id}`); load(); }

  return (
    <AdminLayout title="إدارة الإعلانات / Ads">
      <form className="admin-form" onSubmit={save}>
        <div className="row">
          <div><label>العنوان (عربي)</label><input value={form.titleAr} onChange={(e) => set('titleAr', e.target.value)} required /></div>
          <div><label>Title (EN)</label><input value={form.titleEn} onChange={(e) => set('titleEn', e.target.value)} required /></div>
        </div>
        <div className="row">
          <div><label>النص (عربي)</label><input value={form.bodyAr} onChange={(e) => set('bodyAr', e.target.value)} /></div>
          <div><label>Body (EN)</label><input value={form.bodyEn} onChange={(e) => set('bodyEn', e.target.value)} /></div>
        </div>
        <div className="row">
          <div>
            <label>الموضع / Placement</label>
            <select value={form.placement} onChange={(e) => set('placement', e.target.value)}>
              <option value="home_top">أعلى الرئيسية / home_top</option>
              <option value="home_bottom">أسفل الرئيسية / home_bottom</option>
              <option value="product_page">صفحة المنتج / product_page</option>
            </select>
          </div>
          <div><label>الترتيب / Order</label><input type="number" value={form.sortOrder} onChange={(e) => set('sortOrder', e.target.value)} /></div>
        </div>
        <label>رابط النقر / Click URL (اختياري)</label>
        <input value={form.linkUrl} onChange={(e) => set('linkUrl', e.target.value)} placeholder="https://..." />
        <label>صورة الإعلان (اختياري)</label>
        <input type="file" accept="image/*" onChange={uploadImg} />
        {form.imageUrl && <img className="cell-thumb" src={absUrl(form.imageUrl)} alt="" />}
        <div className="actions">
          <button type="submit">{editingId ? 'تحديث' : 'إضافة'}</button>
          {editingId && <button type="button" className="ghost" onClick={reset}>جديد</button>}
          {msg && <span className="msg">{msg}</span>}
        </div>
      </form>

      <div className="table-wrap">
      <table className="admin-table">
        <thead><tr><th>العنوان</th><th>الموضع</th><th>الترتيب</th><th>الحالة</th><th></th></tr></thead>
        <tbody>
          {items.map((a) => (
            <tr key={a.id}>
              <td>{a.titleAr || a.titleEn}</td>
              <td>{a.placement}</td>
              <td>{a.sortOrder}</td>
              <td>{a.active ? 'نشط' : 'متوقف'}</td>
              <td className="row-actions">
                <a className="view-link" href="/" target="_blank" rel="noreferrer">عرض ↗</a>
                <button onClick={() => edit(a)}>تعديل</button>
                <button onClick={() => toggle(a)}>{a.active ? 'إيقاف' : 'تفعيل'}</button>
                <button className="danger" onClick={() => remove(a)}>حذف</button>
              </td>
            </tr>
          ))}
          {items.length === 0 && <tr><td colSpan={5}>لا توجد إعلانات</td></tr>}
        </tbody>
      </table>
      </div>
    </AdminLayout>
  );
}
