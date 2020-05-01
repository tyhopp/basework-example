const baseworkConfig = () => ({
  bundler: 'webpack',
  build: [
    'prepare',
    'prefetch',
    'transform',
    'bundle',
    'create',
    'prerender'
  ]
});

module.exports = baseworkConfig;