import type { Project } from "@pnpm/types";
import { join } from "path";
import { tsAlterRef, type tsConfigWithRef } from "../tsAlterRef.js";

vi.mock("fs-extra", () => ({
  readJSON: vi.fn(() => Promise.resolve({})),
  writeJSON: vi.fn(() => Promise.resolve()),
}));
const fse = vi.mocked(require("fs-extra"));

function makeProjects(dirs: string[]) {
  return dirs.map(dir => ({
    rootDir: join("./", dir),
    rootDirRealPath: join("/path/repo", dir),
  })) as Project[];
}
function makeTsConfig(...refsPaths: string[]): tsConfigWithRef {
  return { references: refsPaths.map(path => ({ path })) };
}

describe("src/lib/tsAddRef.ts pub fn tsAddRef", () => {
  it("usually adds references well", async () => {
    const refers = makeProjects(["a", "b/e"]);
    const refees = makeProjects(["a/c", "d"]);
    await tsAlterRef(refers, refees);
    expect(fse.writeJSON.mock.calls).toEqual([
      [expect.anything(), makeTsConfig("c", "../d")],
      [expect.anything(), makeTsConfig("../../a/c", "../../d")],
    ]);
  });

  it("won't overwrite existed references", async () => {
    const refers = makeProjects(["a"]);
    const refees = makeProjects(["b"]);
    fse.readJSON.mockResolvedValue(makeTsConfig("/another/c"));
    await tsAlterRef(refers, refees);
    expect(fse.writeJSON.mock.calls[0]).toEqual([
      expect.anything(),
      makeTsConfig("/another/c", "../b"),
    ]);
  });

  it("usually removes references well", async () => {
    const refers = makeProjects(["a"]);
    const refees = makeProjects(["c"]);
    fse.readJSON.mockResolvedValue(makeTsConfig("../b", "../c", "../d"));
    await tsAlterRef(refers, refees, { action: "remove" });
    expect(fse.writeJSON.mock.calls[0]).toEqual([
      expect.anything(),
      makeTsConfig("../b", "../d"),
    ]);
  });
});
