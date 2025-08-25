import type { Project } from "@pnpm/types";
import { readJSON, writeJSON } from "fs-extra";
import { join, relative } from "path";

export interface tsProjectRef {
  path: string;
  prepend?: boolean;
}

export async function tsAlterRef(
  referencers: Project[],
  referencees: Project[],
) {
  for (const referencer of referencers) {
    const refs: tsProjectRef[] = referencees.map(ref => ({
      path: relative(referencer.rootDirRealPath, ref.rootDirRealPath),
    }));
    const tsconfigDir = join(referencer.rootDirRealPath, "tsconfig.json");
    const tsconfig = await readJSON(tsconfigDir);
    if (!(tsconfig.references instanceof Array)) tsconfig.references = [];
    (tsconfig.references as tsProjectRef[]).push(...refs);
    await writeJSON(tsconfigDir, tsconfig);
  }
}
