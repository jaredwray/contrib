module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  preset: 'ts-jest',
  collectCoverageFrom: ['**/*.ts?(x)'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
};
