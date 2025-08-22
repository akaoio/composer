module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/test/**/*.test.ts'
  ],
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '^(.*)\\.js$': '$1'
  },
  collectCoverageFrom: [
    'dist/**/*.js',
    '!dist/**/*.d.ts'
  ],
  coverageDirectory: 'tmp/coverage',
  coverageReporters: ['text', 'lcov', 'html']
};