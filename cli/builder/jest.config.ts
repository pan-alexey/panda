import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  roots: ['<rootDir>/src'],
  preset: 'ts-jest',
  collectCoverageFrom: ['src/**/*.[jt]s?(x)', '!**/*.d.ts', '!/node_modules/**', '!**/mock/**', '!**/fixture/**'],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  modulePathIgnorePatterns: ['mocks', 'fixture'],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
  },
};
export default config;
