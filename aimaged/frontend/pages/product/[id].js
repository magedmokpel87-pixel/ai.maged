import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import ar from '../../locales/ar.json';
import en from '../../locales/en.json';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const t = router.locale === 'en' ? en : ar;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!id) return;
    axios.get(`${API_BASE}/api/products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  if (!product) return <div><Header /></div>;

  const title = router.locale === 'en' ? product.titleEn : product.titleAr;
  const description = router.locale === 'en' ? product.descriptionEn : product.descriptionAr;

  return (
    <div>
      <Header />
      <div className="product-page">
        <div className="gallery">
          {(product.images || []).map((src) => (
            <img key={src} src={src} alt={title} />
          ))}
          {product.videoUrl && (
            <video controls style={{ width: '100%', borderRadius: 12 }}>
              <source src={product.videoUrl} />
            </video>
          )}
        </div>
        <div>
          <h1>{title}</h1>
          <p>{product.price} {product.currency}</p>
          <h3>{t.description}</h3>
          <p>{description}</p>
          <a className="button" href={`/checkout?productId=${product.id}`}>
            {t.buy_now}
          </a>
        </div>
      </div>
    </div>
  );
}
