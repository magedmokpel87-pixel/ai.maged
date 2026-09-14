import { useRouter } from 'next/router';
import { useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import ar from '../locales/ar.json';
import en from '../locales/en.json';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export default function Checkout() {
  const router = useRouter();
  const { productId } = router.query;
  const t = router.locale === 'en' ? en : ar;
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState(null);

  async function submit(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(
        `${API_BASE}/api/orders`,
        { items: [{ productId, quantity: Number(quantity) }] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus({ ok: true, order: res.data });
    } catch (err) {
      setStatus({ ok: false, error: err.response?.data?.error || 'Error' });
    }
  }

  return (
    <div>
      <Header />
      <form className="checkout-form" onSubmit={submit}>
        <h2>{t.checkout}</h2>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <button className="button" type="submit">{t.checkout}</button>
        {status && (status.ok ? <p>✔ {status.order.id}</p> : <p style={{ color: 'salmon' }}>{status.error}</p>)}
      </form>
    </div>
  );
}
