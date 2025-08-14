import { copyPreset } from "../../src/lib/preset";

jest.mock("fs-extra", () => ({
  exists: jest.fn(
    (() => {
      // Get true first, then false, then true ...
      let count = 1;
      return () => Promise.resolve(!(++count, (count %= 2)));
    })(),
  ),
  copy: jest.fn(() => Promise.resolve()),
}));
const fse = jest.mocked(require("fs-extra"));

describe("src/lib/preset.ts' pub fn copyPreset", () => {
  const files = ["There're", "3", "files"];
  const log = jest.spyOn(console, "log").mockImplementation();
  const warn = jest.spyOn(console, "warn").mockImplementation();

  beforeEach(() => jest.clearAllMocks());

  it("works well with Promise", async () => {
    await copyPreset(Promise.resolve(files), ".");
    expect(fse.copy.mock.calls).toHaveLength(3);
  });

  it("works well with string[]", async () => {
    await copyPreset(files, ".");
    expect(fse.copy.mock.calls).toHaveLength(3);
  });

  it("refuses to overwrite existed files", async () => {
    fse.exists.mockResolvedValue(true);
    await copyPreset(["existed"], ".");
    expect(log.mock.calls[0][0]).toMatch(/^existed has existed/);
  });

  it("refuses to copy unknown presets", async () => {
    fse.exists.mockResolvedValue(false);
    await copyPreset(["undefined"], ".");
    expect(warn.mock.calls[0][0]).toMatch(/^undefined is unknown/);
  });
});
