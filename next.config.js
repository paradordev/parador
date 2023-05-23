/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ["id", "en"],
    defaultLocale: "id",
    localeDetection: false,
  },
  reactStrictMode: true,
  images: {
    domains: [
      "prdr.bigkuma.com",
      "dev.parador-hotels.com",
      "parador-hotels.com",
      "backend.parador-hotels.com",
    ],
  },
  experimental: {
    outputStandalone: true,
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  },
  async rewrites() {
    return {
      fallback:[
        {
          source: '/api/:path*',
          destination: '/api/:path*',
        },
      ],
      beforeFiles: [
        {
          source: "/shop/cart/checkout",
          destination: "/shop/cart/checkout",
          has: [{ type: "query", key: "proccess" }],
        },
      ],
    };
  },
  async redirects() {
    return [
      {
        source: "/contact-us",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/index.php",
        destination: "/",
        permanent: true,
      },
      {
        source: "/index.php/en",
        destination: "/",
        permanent: true,
      },
      {
        source: "/about-us/corporate-team",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
