/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true
  
}

module.exports = nextConfig

//ina can you see this

// module.exports = (phase, { defaultConfig }) => {
//   return {
//     ...defaultConfig,

//     webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
//       config.node = {
//         fs: 'empty'
//       }
//       return config
//     },
//   }
// }