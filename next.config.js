/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/patient',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
