import { API_BASE } from '../lib/api';

export async function getServerSideProps({ res }) {
  const txt = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    '',
    `Sitemap: ${API_BASE}/sitemap.xml`,
    '',
  ].join('\n');
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.write(txt);
  res.end();
  return { props: {} };
}

export default function Robots() {
  return null;
}
