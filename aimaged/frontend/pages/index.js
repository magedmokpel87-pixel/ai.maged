import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import Header from '../components/Header';
import AdBanner from '../components/AdBanner';
import AdminBar from '../components/AdminBar';
import Seo from '../components/Seo';
import ar from '../locales/ar.json';
import en from '../locales/en.json';
import { SERVER_API_BASE, API_BASE, absUrl } from '../lib/api';

async function fetchJson(url, params) {
  try {
    const res = await axios.get(`${SERVER_API_BASE}${url}`, { params });
    return res.data;
  } catch {
    return null;
  }
}

export async function getServerSideProps({ locale }) {
  const lang = locale === 'en' ? 'en' : 'ar';
  const [products, topAds, bottomAds, home] = await Promise.all([
    fetchJson('/api/products'),
    fetchJson('/api/ads', { placement: 'home_top' }),
    fetchJson('/api/ads', { placement: 'home_bottom' }),
    fetchJson('/api/pages/home', { locale: lang }),
  ]);
  return {
    props: {
      products: products || [],
      topAds: topAds || [],
      bottomAds: bottomAds || [],
      home: home || null,
    },
  };
}

export default function Home({ products, topAds, bottomAds, home }) {
  const router = useRouter();
  const lang = router.locale === 'en' ? 'en' : 'ar';
  const t = lang === 'en' ? en : ar;
  const body = home?.body || {};

  const heroTitle = body.hero_title || (lang === 'en' ? 'Books & knowledge by AI' : 'كتب ومعرفة بالذكاء الاصطناعي');
  const heroSub = body.hero_subtitle || (lang === 'en' ? 'Curated books and courses on AI.MAGED.' : 'كتب ودورات مختارة من AI.MAGED.');

  const seoTitle = home?.title ? `${home.title} — AI.MAGED` : `${heroTitle} — AI.MAGED`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AI.MAGED',
    url: API_BASE,
    inLanguage: lang === 'en' ? 'en' : 'ar',
    potentialAction: {
      '@type': 'SearchAction',
      Target: `${API_BASE}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <div>
      <Seo title={seoTitle} description={heroSub} jsonLd={jsonLd} />
      <AdminBar pageKey="home" />
      <Header />
      {topAds.map((ad) => (
        <AdBanner key={ad.id} ad={ad} lang={lang} />
      ))}
      <section className="hero">
        <h1>{heroTitle}</h1>
        <p>{heroSub}</p>
      </section>
      <div className="product-grid">
        {products.map((p) => {
          const cover = p.images && p.images[0] ? absUrl(p.images[0]) : null;
          return (
            <Link key={p.id} href={`/product/${p.id}`} className="product-card">
              {cover ? <img src={cover} alt={lang === 'en' ? p.titleEn : p.titleAr} /> : <div className="no-cover">AI.MAGED</div>}
              <div className="body">
                <h3>{lang === 'en' ? p.titleEn : p.titleAr}</h3>
                <p>{p.price} {p.currency}</p>
              </div>
            </Link>
          );
        })}
        {products.length === 0 && <p style={{ padding: 24 }}>{lang === 'en' ? 'No books yet — add them from the dashboard.' : 'لا توجد كتب بعد — أضفها من لوحة التحكم.'}</p>}
      </div>
      {bottomAds.map((ad) => (
        <AdBanner key={ad.id} ad={ad} lang={lang} />
      ))}
      {body.footer_text && <footer className="site-footer">{body.footer_text}</footer>}
    </div>
  );
}
