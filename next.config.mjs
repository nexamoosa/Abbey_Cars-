const phpApiOrigin = process.env.PHP_API_ORIGIN || 'http://localhost/Abbey_Cars'

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${phpApiOrigin}/api/:path*` },
      { source: '/uploads/:path*', destination: `${phpApiOrigin}/uploads/:path*` },
    ]
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
