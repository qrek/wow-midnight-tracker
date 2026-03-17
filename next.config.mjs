/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'render.worldofwarcraft.com' },
      { protocol: 'https', hostname: 'assets.warcraftlogs.com' },
      { protocol: 'https', hostname: 'wow.zamimg.com' },
    ],
  },
}

export default nextConfig
