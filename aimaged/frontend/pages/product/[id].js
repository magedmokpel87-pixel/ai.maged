import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import Seo from '../../components/Seo';
import AdminBar from '../../components/AdminBar';
import { API_BASE, absUrl } from '../../lib/api';
import ar from '../../locales/ar.json';
import en from '../../locales/en.json';


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
  const cover = product.images && product.images[0] ? absUrl(product.images[0]) : null;
  const pageUrl = `${API_BASE}${router.asPath.split('?')[0]}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': product.kind === 'course' ? 'Course' : 'Book',
    name: title,
    description,
    image: cover || undefined,
    inLanguage: router.locale === 'en' ? 'en' : 'ar',
    offers: {
      '@type': 'Offer',
      price: Number(product.price),
      priceCurrency: product.currency,
      url: pageUrl,
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <div>
      <Seo
        title={`${title} — AI.MAGED`}
        description={(description || '').slice(0, 160)}
        image={cover || undefined}
        jsonLd={jsonLd}
      />
      <AdminBar />
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
