import type { Project } from "@pnpm/types";
import { join, relative } from "path";
import { tsAddRef } from "../tsAddRef";

jest.mock("fs-extra", () => ({
  readJSON: jest.fn(() => Promise.resolve({})),
  writeJSON: jest.fn(() => Promise.resolve()),
}));
const fse = jest.mocked(require("fs-extra"));

function makeProjects(dirs: string[]) {
  return dirs.map(dir => ({
    rootDir: join("./", dir),
    rootDirRealPath: join("/path/repo", dir),
  })) as Project[];
}
function tsConfig(path: string) {
  return join(path, "tsconfig.json");
}

describe("src/lib/tsAddRef.ts pub fn tsAddRef", () => {
  it("usually works well", async () => {
    const refers = makeProjects(["a", "b"]);
    const refees = makeProjects(["c", "d"]);
    await tsAddRef(refers, refees);
    const args = refers.map(refer => [
      tsConfig(refer.rootDirRealPath),
      {
        references: refees.map(refee => ({
          path: relative(refer.rootDirRealPath, refee.rootDirRealPath),
        })),
      },
    ]);
    expect(fse.writeJSON.mock.calls).toEqual(args);
  });

  it("won't overwrite existed references", async () => {
    const refers = makeProjects(["a"]);
    const refees = makeProjects(["b"]);
    fse.readJSON.mockResolvedValue({ references: [{ path: "/another/c" }] });
    await tsAddRef(refers, refees);
    expect(fse.writeJSON.mock.calls[0]).toEqual([
      tsConfig(refers[0].rootDirRealPath),
      {
        references: [
          { path: "/another/c" },
          {
            path: relative(
              refers[0].rootDirRealPath,
              refees[0].rootDirRealPath,
            ),
          },
        ],
      },
    ]);
  });
});
