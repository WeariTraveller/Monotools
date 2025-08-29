import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    AutoImport({
      imports: ["vitest"],
      dts: true,
    }),
  ],
  test: {
    mockReset: true,
  },
});
