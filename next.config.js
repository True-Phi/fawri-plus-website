// next.config.js
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  env: {
    stackbitPreview: process.env.STACKBIT_PREVIEW
  },
  trailingSlash: true,
  reactStrictMode: true,
  allowedDevOrigins: ['192.168.1.84'],
  // ── Add i18n support ─────────────────────────────────────────────────────────
  i18n: {
    locales: ['en', 'ar'],
    defaultLocale: 'en',
    localeDetection: false
  }
};

module.exports = nextConfig;
