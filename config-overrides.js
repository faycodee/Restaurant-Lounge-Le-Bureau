module.exports = function override(config) {
    config.module.rules.push({
      test: /\.mjs$/,
      enforce: 'pre',
      use: ['source-map-loader'],
      exclude: /node_modules\/@mediapipe\/tasks-vision/,
    });
    return config;
  };
  