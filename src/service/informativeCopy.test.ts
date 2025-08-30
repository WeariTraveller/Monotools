import { copy } from "./informativeCopy.js";

vi.mock("fs-extra", () => ({
  default: {
    exists: vi.fn(
      (() => {
        // Get true first, then false, then true ...
        let count = 1;
        return () => Promise.resolve(!(++count, (count %= 2)));
      })(),
    ),
    copy: vi.fn(() => Promise.resolve()),
  },
}));
const fse = vi.mocked((await import("fs-extra")).default, { deep: true });

describe("src/service/informativeCopy.ts' pub fn copy", () => {
  const log = vi.spyOn(console, "log").mockImplementation(vi.fn());
  const warn = vi.spyOn(console, "warn").mockImplementation(vi.fn());

  it("usually works well", async () => {
    await copy("file", "");
    expect(log.mock.calls.flat()).toEqual(
      expect.arrayOf(expect.stringMatching(/^√/)),
    );
    expect(warn).toHaveBeenCalledTimes(0);
    expect(fse.copy).toHaveBeenCalledTimes(1);
  });

  it("inform right log to refuse to overwrite", async () => {
    // It seems not to choose the correct overload. It chose the one with callback
    fse.exists.mockResolvedValue(true as unknown as void);
    await copy("", "existed", { overwrite: false });
    expect(log.mock.calls[0][0]).toMatch(/^existed already existed/);
    expect(warn).toHaveBeenCalledTimes(0);
    expect(fse.copy).toHaveBeenCalledTimes(0);
  });

  it("refuses to copy unknown source", async () => {
    fse.exists.mockResolvedValue(false as unknown as void);
    await copy("undefined", "");
    expect(log).toHaveBeenCalledTimes(0);
    expect(warn.mock.calls[0][0]).toMatch(/^⚠️ undefined is unknown/);
    expect(fse.copy).toHaveBeenCalledTimes(0);
  });
});
