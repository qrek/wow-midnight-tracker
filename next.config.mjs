/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'render.worldofwarcraft.com' },
      { protocol: 'https', hostname: 'assets.warcraftlogs.com' },
      { protocol: 'https', hostname: 'wow.zamimg.com' },
      { protocol: 'https', hostname: 'www.method.gg' },
    ],
  },
}

export default nextConfig
