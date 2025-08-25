import type { Project } from "@pnpm/types";
import { readJSON, writeJSON } from "fs-extra";
import { join, relative } from "path";

export interface tsProjectRef {
  path: string;
  prepend?: boolean;
}

export namespace tsAlterRef {
  export type Action = "Add" | "Remove";
  export type Opts = {
    action?: Action;
  };
}

export async function tsAlterRef(
  referencers: Project[],
  referencees: Project[],
  opts: tsAlterRef.Opts = { action: "Add" },
) {
  for (const referencer of referencers) {
    const refs: tsProjectRef[] = referencees.map(ref => ({
      path: relative(referencer.rootDirRealPath, ref.rootDirRealPath),
    }));
    const tsconfigDir = join(referencer.rootDirRealPath, "tsconfig.json");
    const tsconfig = await readJSON(tsconfigDir);
    beTsConfigWithRef(tsconfig);
    tsconfig.references.push(...refs);
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
