import type { Project } from "@pnpm/types";
import { readJSON, writeJSON } from "fs-extra";
import { join, relative } from "upath";

export interface tsProjectRef {
  path: string;
  prepend?: boolean;
}

export namespace tsAlterRef {
  export type Action = "Add" | "Remove";
  export type Opts = {
    action: Action;
  };
}

const actionMap = {
  Add: tsConfigAddRef,
  Remove: tsConfigRmvRef,
};

export async function tsAlterRef(
  referencers: Project[],
  referencees: Project[],
  opts: tsAlterRef.Opts = { action: "Add" },
) {
  const act = actionMap[opts.action];
  for (const referencer of referencers) {
    const refs: tsProjectRef[] = referencees.map(ref => ({
      path: relative(referencer.rootDirRealPath, ref.rootDirRealPath),
    }));
    const tsconfigDir = join(referencer.rootDirRealPath, "tsconfig.json");
    const tsconfig = await readJSON(tsconfigDir);
    beTsConfigWithRef(tsconfig);
    act(tsconfig, refs);
    await writeJSON(tsconfigDir, tsconfig);
  }
}

export interface tsConfigWithRef {
  references: tsProjectRef[];
}

function beTsConfigWithRef(config: any): asserts config is tsConfigWithRef {
  if (typeof config !== "object")
    throw new TypeError("Expect tsconfig.json as an object");
  if (!(config.references instanceof Array)) config.references = [];
}

export function tsConfigAddRef(config: tsConfigWithRef, refs: tsProjectRef[]) {
  config.references.push(...refs);
}

export function tsConfigRmvRef(config: tsConfigWithRef, refs: tsProjectRef[]) {
  const refsPaths = new Set(refs.map(ref => ref.path));
  config.references.filter(ref => !refsPaths.has(ref.path));
}
