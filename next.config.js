/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  env: {
    stackbitPreview: process.env.STACKBIT_PREVIEW
  },

  /*–– NEW -––––––––––––––––––––––*/
  i18n: {
    locales: ['en', 'ar'],
    defaultLocale: 'en'
  },
  /*––––––––––––––––––––––––––––––*/

  trailingSlash: true,
  reactStrictMode: true,

  /* only for your LAN hot-reload – keep whatever IPs you need */
  allowedDevOrigins: ['192.168.1.84']
};

module.exports = nextConfig;
