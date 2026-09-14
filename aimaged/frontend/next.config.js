/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['ar', 'en'],
    defaultLocale: 'ar',
  },
  images: {
    // Allow high-resolution product images from the affiliate/CDN sources
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};

module.exports = nextConfig;
