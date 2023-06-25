/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    scrollRestoration: true,
  },
  images: {
    domains: ["pbs.twimg.com"],
  },
};

module.exports = nextConfig;
