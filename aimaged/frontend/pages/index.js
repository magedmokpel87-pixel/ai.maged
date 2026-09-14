import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Header from '../components/Header';
import AdBanner from '../components/AdBanner';
import ar from '../locales/ar.json';
import en from '../locales/en.json';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export default function Home() {
  const router = useRouter();
  const t = router.locale === 'en' ? en : ar;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/products`)
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]));
  }, []);

  return (
    <div>
      <Header />
      <AdBanner
        ad={{ id: 'default', title: t.ad_banner_default, description: 'AI.MAGED' }}
      />
      <div className="product-grid">
        {products.map((p) => (
          <a
            key={p.id}
            className="product-card"
            href={`/product/${p.id}`}
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            <img src={p.images && p.images[0]} alt={router.locale === 'en' ? p.titleEn : p.titleAr} />
            <div className="body">
              <h3>{router.locale === 'en' ? p.titleEn : p.titleAr}</h3>
              <p>{p.price} {p.currency}</p>
            </div>
          </a>
        ))}
        {products.length === 0 && <p style={{ padding: 24 }}>—</p>}
      </div>
    </div>
  );
}
