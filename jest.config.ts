import type { Config } from 'jest'

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    '<rootDir>/src/test/setup.ts',
    '<rootDir>/src/test/load-env.ts',
    '<rootDir>/src/test/prisma-mock.ts'
  ],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '^.+\\.(css|sass|scss)$': require.resolve('./src/test/mocks/style.js'),
    '^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp)$': require.resolve(
      './src/test/mocks/file.js'
    ),
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/test/components/transaction-dialog.test.tsx',
    '/test/components/user-account.test.tsx'
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!jose)',
    '^.+\\.module\\.(css|sass|scss)$'
  ],
  watchPathIgnorePatterns: ['/.next/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }]
  }
}

export default config
