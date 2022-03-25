/** @type {import('next').NextConfig} */

module.exports = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  experimental: {
    images: {
      layoutRaw: true,
    },
  },
}
