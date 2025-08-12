/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from "jest";

const config: Config = {
  // Stop running tests after `n` failures
  // bail: 0,

  // A path to a module which exports an async function that is triggered once before all test suites
  // globalSetup: undefined,

  // A path to a module which exports an async function that is triggered once after all test suites
  // globalTeardown: undefined,

  // A set of global variables that need to be available in all test environments
  // globals: {},

  testMatch: ["**/?(*.)+(spec|test).?([mc])[jt]s?(x)"],
  moduleFileExtensions: ["js", "cjs", "ts", "json"],
  preset: "ts-jest",
  roots: ["<rootDir>/tests"],
  verbose: true,
  errorOnDeprecated: true,

  // The paths to modules that run some code to configure or set up the testing environment before each test
  // setupFiles: [],

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  // setupFilesAfterEnv: [],
};

export default config;
