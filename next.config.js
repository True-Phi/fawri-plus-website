/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* expose the Stackbit preview flag */
  env: { stackbitPreview: process.env.STACKBIT_PREVIEW },

  /* we still need a trailing slash for the starter */
  trailingSlash: true,

  /* turn off automatic locale detection (the user clicks to switch) */
  i18n: {
    locales: ['en', 'ar'],
    defaultLocale: 'en',
    localeDetection: false
  },

  /* optional – keep your LAN IP if you really need it */
  allowedDevOrigins: ['192.168.1.84']
};

module.exports = nextConfig;
