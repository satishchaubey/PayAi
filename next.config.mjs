/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    RESEND_API_KEY: "f81cee44-0356-445b-8496-e197d27cb939",
    DEMO_TO_EMAIL: "satishchaubey02@gmail.com",
    RESEND_FROM_EMAIL: "onboarding@resend.dev",
    SARVAM_API_KEY:"sk_l6htjdb5_jqEKgnKc6Ry2SfZwzgtLYqwM",
    SARVAM_MODEL: "sarvam-m"
  },
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
