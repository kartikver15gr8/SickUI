/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ["@sickui/core"],
  experimental: {
    optimizePackageImports: ["@sickui/core"],
  },
}

module.exports = nextConfig
