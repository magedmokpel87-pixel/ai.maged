import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { api, absUrl } from '../../lib/api';

const EMPTY = {
  kind: 'book',
  titleAr: '',
  titleEn: '',
  descriptionAr: '',
  descriptionEn: '',
  price: 0,
  currency: 'USD',
  images: [],
  affiliateUrl: '',
  featured: false,
  active: true,
};

export default function AdminBooks() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState('');

  function load() {
    api.get('/api/products/all').then((r) => setItems(r.data));
  }
  useEffect(load, []);

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function edit(p) {
    setEditingId(p.id);
    setForm({ ...EMPTY, ...p, price: Number(p.price), affiliateUrl: p.affiliateUrl || '', images: p.images || [] });
  }

  function reset() {
    setEditingId(null);
    setForm(EMPTY);
  }

  async function uploadCover(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    setMsg('جارٍ الرفع...');
    try {
      const r = await api.post('/api/uploads', fd);
      set('images', [...form.images, r.data.url]);
      setMsg('تم الرفع ✓');
    } catch {
      setMsg('فشل الرفع');
    }
  }

  async function save(e) {
    e.preventDefault();
    setMsg('');
    const payload = {
      ...form,
      affiliateUrl: form.affiliateUrl || undefined,
      price: Number(form.price),
    };
    try {
      if (editingId) await api.put(`/api/products/${editingId}`, payload);
      else await api.post('/api/products', payload);
      setMsg('تم الحفظ ✓');
      reset();
      load();
    } catch (err) {
      setMsg('خطأ: ' + (err.response?.data?.error || 'فشل الحفظ'));
    }
  }

  async function toggleActive(p) {
    await api.put(`/api/products/${p.id}`, { active: !p.active });
    load();
  }

  async function remove(p) {
    await api.delete(`/api/products/${p.id}`);
    load();
  }

  return (
    <AdminLayout title="إدارة الكتب / Books">
      <form className="admin-form" onSubmit={save}>
        <div className="row">
          <div>
            <label>نوع / Kind</label>
            <select value={form.kind} onChange={(e) => set('kind', e.target.value)}>
              <option value="book">كتاب / book</option>
              <option value="course">دورة / course</option>
              <option value="product">منتج / product</option>
            </select>
          </div>
          <div>
            <label>السعر / Price</label>
            <input type="number" step="0.01" value={form.price} onChange={(e) => set('price', e.target.value)} />
          </div>
          <div>
            <label>العملة / Currency</label>
            <input value={form.currency} onChange={(e) => set('currency', e.target.value)} />
          </div>
        </div>
        <div className="row">
          <div><label>العنوان (عربي)</label><input value={form.titleAr} onChange={(e) => set('titleAr', e.target.value)} required /></div>
          <div><label>Title (EN)</label><input value={form.titleEn} onChange={(e) => set('titleEn', e.target.value)} required /></div>
        </div>
        <div className="row">
          <div><label>الوصف (عربي)</label><textarea value={form.descriptionAr} onChange={(e) => set('descriptionAr', e.target.value)} required /></div>
          <div><label>Description (EN)</label><textarea value={form.descriptionEn} onChange={(e) => set('descriptionEn', e.target.value)} required /></div>
        </div>
        <label>رابط الشراء / Affiliate URL (اختياري)</label>
        <input value={form.affiliateUrl} onChange={(e) => set('affiliateUrl', e.target.value)} placeholder="https://..." />
        <label>الغلاف / Cover image</label>
        <input type="file" accept="image/*" onChange={uploadCover} />
        <div className="thumbs">
          {form.images.map((src, i) => (
            <span key={src} className="thumb">
              <img src={absUrl(src)} alt="" />
              <button type="button" onClick={() => set('images', form.images.filter((_, x) => x !== i))}>✕</button>
            </span>
          ))}
        </div>
        <label className="check">
          <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} />
          مميّز / Featured
        </label>
        <div className="actions">
          <button type="submit">{editingId ? 'تحديث / Update' : 'إضافة / Add'}</button>
          {editingId && <button type="button" className="ghost" onClick={reset}>جديد / New</button>}
          {msg && <span className="msg">{msg}</span>}
        </div>
      </form>

      <div className="table-wrap">
      <table className="admin-table">
        <thead><tr><th>الغلاف</th><th>العنوان</th><th>النوع</th><th>السعر</th><th>الحالة</th><th></th></tr></thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id}>
              <td>{p.images?.[0] ? <img className="cell-thumb" src={absUrl(p.images[0])} alt="" /> : '—'}</td>
              <td>{p.titleAr || p.titleEn}</td>
              <td>{p.kind}</td>
              <td>{p.price} {p.currency}</td>
              <td>{p.active ? 'نشط' : 'متوقف'}</td>
              <td className="row-actions">
                <a className="view-link" href={`/product/${p.id}`} target="_blank" rel="noreferrer">عرض ↗</a>
                <button onClick={() => edit(p)}>تعديل</button>
                <button onClick={() => toggleActive(p)}>{p.active ? 'إيقاف' : 'تفعيل'}</button>
                <button className="danger" onClick={() => remove(p)}>حذف</button>
              </td>
            </tr>
          ))}
          {items.length === 0 && <tr><td colSpan={6}>لا توجد كتب بعد</td></tr>}
        </tbody>
      </table>
      </div>
    </AdminLayout>
  );
}
