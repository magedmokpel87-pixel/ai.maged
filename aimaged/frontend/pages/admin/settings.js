import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { api, getToken, decodeRole } from '../../lib/api';

export default function AdminSettings() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const email = (() => {
    try {
      return JSON.parse(atob(getToken().split('.')[1])).email;
    } catch {
      return '';
    }
  })();

  async function submit(e) {
    e.preventDefault();
    setMsg('');
    setErr('');
    if (next.length < 8) return setErr('كلمة السر الجديدة يجب ألا تقل عن 8 أحرف');
    if (next !== confirm) return setErr('كلمتا السر غير متطابقتين');
    setBusy(true);
    try {
      await api.post('/api/auth/change-password', { currentPassword: current, newPassword: next });
      setMsg('تم تغيير كلمة السر بنجاح ✓');
      setCurrent('');
      setNext('');
      setConfirm('');
    } catch (e2) {
      setErr(e2.response?.data?.error || 'فشل تغيير كلمة السر');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminLayout title="الإعدادات / Settings">
      <div className="admin-cards">
        <section className="admin-card">
          <h2>الحساب / Account</h2>
          <p className="muted">الحساب الحالي: <b>{email}</b> · الدور: {decodeRole(getToken())}</p>
        </section>

        <section className="admin-card">
          <h2>تغيير كلمة المرور / Change Password</h2>
          <form className="admin-form" onSubmit={submit}>
            <div>
              <label>كلمة السر الحالية / Current</label>
              <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} required autoComplete="current-password" />
            </div>
            <div>
              <label>كلمة السر الجديدة / New (8+ أحرف)</label>
              <input type="password" value={next} onChange={(e) => setNext(e.target.value)} required autoComplete="new-password" />
            </div>
            <div>
              <label>تأكيد الجديدة / Confirm</label>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required autoComplete="new-password" />
            </div>
            {err && <p className="form-error">{err}</p>}
            {msg && <p className="form-ok">{msg}</p>}
            <div className="actions">
              <button type="submit" disabled={busy}>{busy ? '...' : 'حفظ كلمة السر / Save'}</button>
            </div>
          </form>
        </section>
      </div>
    </AdminLayout>
  );
}
