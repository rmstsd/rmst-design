import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // output: 'export', // Outputs a Single-Page Application (SPA)
  reactStrictMode: true,
  turbopack: {
    resolveAlias: {
      'rmst-design': './../rmst-design/dist/index.js'
    }
  }
}

export default nextConfig
