import { copy } from "./informativeCopy.js";

vi.mock("fs-extra", () => ({
  exists: vi.fn(
    (() => {
      // Get true first, then false, then true ...
      let count = 1;
      return () => Promise.resolve(!(++count, (count %= 2)));
    })(),
  ),
  copy: vi.fn(() => Promise.resolve()),
}));
const fse = vi.mocked(require("fs-extra"));

describe("src/service/informativeCopy.ts' pub fn copy", () => {
  const log = vi.spyOn(console, "log").mockImplementation();
  const warn = vi.spyOn(console, "warn").mockImplementation();

  it("usually works well", async () => {
    await copy("file", "");
    expect(log.mock.calls.flat()).toEqual(
      expect.arrayOf(expect.stringMatching(/^√/)),
    );
    expect(warn).toHaveBeenCalledTimes(0);
    expect(fse.copy).toHaveBeenCalledTimes(1);
  });

  it("inform right log to refuse to overwrite", async () => {
    fse.exists.mockResolvedValue(true);
    await copy("", "existed", { overwrite: false });
    expect(log.mock.calls[0][0]).toMatch(/^existed already existed/);
    expect(warn).toHaveBeenCalledTimes(0);
    expect(fse.copy).toHaveBeenCalledTimes(0);
  });

  it("refuses to copy unknown source", async () => {
    fse.exists.mockResolvedValue(false);
    await copy("undefined", "");
    expect(log).toHaveBeenCalledTimes(0);
    expect(warn.mock.calls[0][0]).toMatch(/^⚠️ undefined is unknown/);
    expect(fse.copy).toHaveBeenCalledTimes(0);
  });
});
