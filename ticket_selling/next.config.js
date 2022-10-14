/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}
//ina!!

// module.exports = nextConfig
module.exports = {
    webpack: (config) => {
      config.resolve.fallback = { fs: false, path: false, stream: false, constants: false };
      return config;
  
    },
    
}, nextConfig
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