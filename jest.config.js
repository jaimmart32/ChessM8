// @ts-check

/** @type {import('jest').Config} */
const config = {
  verbose: true,
  testEnvironment: 'jsdom',
  injectGlobals: true,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^classes/(.*)': '<rootDir>/src/js/classes/$1.js',
    '^decorators/(.*)': '<rootDir>/src/js/decorators/$1.js',
    '^utils/(.*)': '<rootDir>/src/js/utils/$1.js',
    'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js': '<rootDir>/src/js/lib/lit-all.min.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  fakeTimers: {
    enableGlobally: true,
  },
}

export default config