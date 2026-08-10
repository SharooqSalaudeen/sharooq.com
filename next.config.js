const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const imageDomains = [
  'localhost',
  'images.unsplash.com',
  'static.gotsby.org',
  'static.ghost.org',
  'gatsby.ghost.io',
  'ghost.org',
  'repository-images.githubusercontent.com',
  'www.gravatar.com',
  'github.githubassets.com',
  'res.cloudinary.com',
  'www.sharooq.com',
  'sharooq.com',
  ...(process.env.IMAGE_DOMAINS || '').split(','),
].map((domain) => domain.trim()).filter(Boolean)

const remotePatterns = imageDomains.map((hostname) => ({
  hostname,
  pathname: '/**',
}))

const baseConfig = {
  // ...(process.env.NETLIFY === 'true' && { target: 'serverless' }),
  images: {
    deviceSizes: [320, 500, 680, 1040, 2080, 2048, 3120],
    remotePatterns,
    qualities: [80, 100],
  },
  reactStrictMode: true,
}

module.exports = (phase, { _defaultConfig }) => {
  const isExport = process.env.IS_EXPORT === 'true'

  return withBundleAnalyzer({
    ...baseConfig,
    ...(isExport && {
      output: 'export',
      images: {
        ...baseConfig.images,
        unoptimized: true,
      },
    }),
  })
}
