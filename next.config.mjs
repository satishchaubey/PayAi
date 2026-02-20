/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net"
      },
      {
        protocol: "https",
        hostname: "cdn.simpleicons.org"
      }
    ]
  }
};

export default nextConfig;
