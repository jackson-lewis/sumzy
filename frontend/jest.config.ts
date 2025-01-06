import type { Config } from 'jest'

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '^.+\\.(css|sass|scss)$': require.resolve('./__mocks__/styleMock.js'),
    '^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp)$': require.resolve(`./__mocks__/fileMock.js`),
    '^@/(.*)$': '<rootDir>/src/$1',
    '@next/font/(.*)': `<rootDir>/__mocks__/nextFontMock.js`,
    'next/font/(.*)': `<rootDir>/__mocks__/nextFontMock.js`,
    'server-only': `<rootDir>/__mocks__/empty.js`
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/'
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!jose)',
    '^.+\\.module\\.(css|sass|scss)$'
  ],
  watchPathIgnorePatterns: [
    '/.next/'
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  }
}

export default config
