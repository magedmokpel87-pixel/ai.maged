import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AI.MAGED - AI & Marketing Tools',
    short_name: 'AI.MAGED',
    description: 'Expert reviews and honest comparisons of AI tools, marketing platforms, and productivity software',
    start_url: '/',
    display: 'standalone',
    background_color: '#060810',
    theme_color: '#5B7FFF',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
