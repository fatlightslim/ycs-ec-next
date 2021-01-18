module.exports = {
  experimental: {
    documentMiddleware: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.node = {
        fs: 'empty'
      };
    }

    return config;
  }

}
