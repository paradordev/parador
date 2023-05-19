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
      "parador-test.vercel.app"
    ],
  },
  experimental: {
    outputStandalone: true,
  },
  async rewrites() {
    return {
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
