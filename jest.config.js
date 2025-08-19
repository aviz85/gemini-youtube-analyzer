module.exports = {
  testEnvironment: 'node',
  transform: {},
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  testPathIgnorePatterns: ['/node_modules/', '/api/'],
  collectCoverageFrom: [
    'api/**/*.js',
    '!api/**/*.test.js',
    '!api/**/*.spec.js'
  ]
};