import axios from 'axios';
import { SERVER_API_BASE, API_BASE } from '../lib/api';

export async function getServerSideProps({ res }) {
  let products = [];
  try {
    const r = await axios.get(`${SERVER_API_BASE}/api/products`);
    products = r.data;
  } catch {}

  const base = API_BASE;
  const urls = [
    { path: '/', freq: 'daily', pri: '1.0' },
    ...products.map((p) => ({ path: `/product/${p.id}`, freq: 'weekly', pri: '0.8' })),
  ];

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
    urls
      .map((u) => {
        const ar = `${base}${u.path}`;
        const en = `${base}/en${u.path === '/' ? '' : u.path}`;
        return (
          '  <url>\n' +
          `    <loc>${ar}</loc>\n` +
          '    <xhtml:link rel="alternate" hreflang="ar" href="' + ar + '"/>\n' +
          '    <xhtml:link rel="alternate" hreflang="en" href="' + en + '"/>\n' +
          `    <changefreq>${u.freq}</changefreq>\n` +
          `    <priority>${u.pri}</priority>\n` +
          '  </url>\n' +
          '  <url>\n' +
          `    <loc>${en}</loc>\n` +
          '  </url>\n'
        );
      })
      .join('') +
    '</urlset>';

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.write(xml);
  res.end();
  return { props: {} };
}

export default function Sitemap() {
  return null;
}
