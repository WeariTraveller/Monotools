import { expect } from "vitest";

expect.extend({
  arrayOf(received: unknown, matcher: unknown) {
    const pass =
      Array.isArray(received) &&
      received.every(item => {
        try {
          expect(item).toEqual(matcher);
          return true;
        } catch {
          return false;
        }
      });

    return {
      pass,
      message: () =>
        `Expected ${JSON.stringify(received)} ${
          pass ? "not " : ""
        }to be an array of ${matcher}`,
    };
  },
});
