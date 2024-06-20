/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  testPathIgnorePatterns: ['node_modules'],
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'jsx'],
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
    '^.+\\.(js|jsx|mjs)$': 'babel-jest',
    '^.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mock__/imageMock.js',
    '^.+\\.(css|less|scss)$': '<rootDir>/__mock__/styleMock.js',
  },
  moduleNameMapper: {
    '\\.(css|less|scss)$': '<rootDir>/__mock__/styleMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setupTests.js'],
  setupFiles: ['<rootDir>/jest.init.js'],
  moduleDirectories: ['node_modules'],
  clearMocks: true,
  coverageDirectory: 'coverage',
};
