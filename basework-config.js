const baseworkConfig = () => ({
  bundler: 'webpack',
  build: [
    'prepare',
    'prefetch',
    'transform',
    'bundle',
    'create',
    'createSubPages',
    'prerender'
  ]
});

module.exports = baseworkConfig;