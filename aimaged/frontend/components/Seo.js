import Head from 'next/head';
import { useRouter } from 'next/router';
import { API_BASE } from '../lib/api';

export default function Seo({ title, description, image, jsonLd }) {
  const router = useRouter();
  const locale = router.locale || 'ar';
  const asPath = (router.asPath || '/').split('?')[0];
  const bare = asPath.replace(/^\/en(?=\/|$)/, '') || '/';
  const urlAr = `${API_BASE}${bare}`;
  const urlEn = `${API_BASE}/en${bare === '/' ? '' : bare}`;
  const canonical = locale === 'en' ? urlEn : urlAr;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} key="desc" />
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hreflang="ar" href={urlAr} />
      <link rel="alternate" hreflang="en" href={urlEn} />
      <link rel="alternate" hreflang="x-default" href={urlAr} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="AI.MAGED" />
      <meta property="og:locale" content={locale === 'en' ? 'en_US' : 'ar_AR'} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      )}
    </Head>
  );
}
