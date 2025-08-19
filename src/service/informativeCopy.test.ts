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

describe("src/service/informativeCopy.ts' pub fn copy", () => {
  const log = jest.spyOn(console, "log").mockImplementation();
  const warn = jest.spyOn(console, "warn").mockImplementation();

  beforeEach(() => jest.clearAllMocks());

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
