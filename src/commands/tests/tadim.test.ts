import yargs from "yargs";
import tadim from "../tadim.js";
import { doParse } from "./util.js";

const parser = yargs().command(tadim);

vi.mock("../../lib/filterPkgInMono.js", () => ({
  globPkgFromDir: vi.fn(() => Promise.resolve({})),
}));
vi.mock("../../lib/tsAlterRef.js", () => ({
  tsAlterRef: vi.fn(() => Promise.resolve()),
}));
const { tsAlterRef } = vi.mocked(await import("../../lib/tsAlterRef.js"));
vi.mock("node:child_process", () => ({
  spawnSync: vi.fn(() => Promise.resolve),
}));
const { spawnSync } = vi.mocked(await import("node:child_process"));

describe("command tadim or tedim", () => {
  it("requires at least 1 filter", async () => {
    const { err } = await doParse(parser, "tadim hi");
    expect(err).toEqual(expect.any(Error));
  });

  it("will call pnpm", async () => {
    await doParse(parser, "tadim hi --filter hello");
    expect(tsAlterRef.mock.calls[0][2]?.action).toEqual("add");
    expect(spawnSync).toHaveBeenCalledTimes(1);
  });

  it("will call pnpm with proper action", async () => {
    await doParse(parser, "tedim hi --filter hello");
    expect(tsAlterRef.mock.calls[0][2]?.action).toEqual("remove");
    expect(spawnSync.mock.calls[0][1]?.[0]).toEqual("remove");
  });

  it("won't call pnpm", async () => {
    await doParse(parser, "tadim hi --filter hello --no-pm");
    expect(tsAlterRef).toHaveBeenCalledTimes(1);
    expect(spawnSync).toHaveBeenCalledTimes(0);
  });

  it("will deprecate some flags", async () => {
    const { err } = await doParse(parser, "tadim hi --filter he -g");
    expect(err).toEqual(expect.any(Error));
  });
});
