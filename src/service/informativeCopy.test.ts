import { copy } from "./informativeCopy";

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

describe("src/lib/preset.ts' pub fn copy", () => {
  const files = ["There're", "3", "files"];
  const log = jest.spyOn(console, "log").mockImplementation();
  const warn = jest.spyOn(console, "warn").mockImplementation();

  beforeEach(() => jest.clearAllMocks());

  it("usually works well", async () => {
    await copy(files, ".");
    expect(log.mock.calls.flat()).toEqual(
      expect.arrayOf(expect.stringMatching(/^√/)),
    );
    expect(warn).toHaveBeenCalledTimes(0);
    expect(fse.copy).toHaveBeenCalledTimes(3);
  });

  it("refuses to overwrite existed files", async () => {
    fse.exists.mockResolvedValue(true);
    await copy(["existed"], ".");
    expect(log.mock.calls[0][0]).toMatch(/^existed already existed/);
    expect(warn).toHaveBeenCalledTimes(0);
    expect(fse.copy).toHaveBeenCalledTimes(0);
  });

  it("refuses to copy unknown presets", async () => {
    fse.exists.mockResolvedValue(false);
    await copy(["undefined"], ".");
    expect(log).toHaveBeenCalledTimes(0);
    expect(warn.mock.calls[0][0]).toMatch(/^undefined is unknown/);
    expect(fse.copy).toHaveBeenCalledTimes(0);
  });
});
