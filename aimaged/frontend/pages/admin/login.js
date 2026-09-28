import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { API_BASE, setToken, decodeRole } from '../../lib/api';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, { email, password });
      if (decodeRole(res.data.token) !== 'admin') {
        setError('هذا الحساب ليس مديرًا / Not an admin account');
        setBusy(false);
        return;
      }
      setToken(res.data.token);
      router.push('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'فشل تسجيل الدخول / Login failed');
      setBusy(false);
    }
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={submit}>
        <h1>AI.MAGED — دخول المدير</h1>
        <label>البريد / Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>كلمة المرور / Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="login-error">{error}</p>}
        <button disabled={busy}>{busy ? '...' : 'دخول / Login'}</button>
      </form>
    </div>
  );
}
