/// <reference types="vitest/globals" />

import "vitest";
declare module "vitest" {
  interface Assertion<T = any> {
    arrayOf(matcher: unknown): void;
  }
  interface AsymmetricMatchersContaining {
    arrayOf(matcher: unknown): void;
  }
}
