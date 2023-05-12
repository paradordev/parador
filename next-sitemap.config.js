/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_URL_PROD || "https://parador-hotels.com",
  generateRobotsTxt: true, // (optional)
};
