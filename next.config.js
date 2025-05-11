/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    env: {
        stackbitPreview: process.env.STACKBIT_PREVIEW,
    },
    trailingSlash: true,
    reactStrictMode: true,
    allowedDevOrigins: [
        '192.168.1.84',
    ],
    output: 'export', // Add static export for Netlify Visual Editor compatibility
};

module.exports = nextConfig;
