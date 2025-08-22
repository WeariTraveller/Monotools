/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testMatch: ["<rootDir>/src/**/*.test.ts", "<rootDir>/tests/**/*.test.ts"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.test.json" }],
  },
  errorOnDeprecated: true,
  clearMocks: true,
};

export default config;
