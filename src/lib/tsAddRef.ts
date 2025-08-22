import type { Project } from "@pnpm/types";
import { readJSON, writeJSON } from "fs-extra";
import { join } from "path";

export interface tsProjectRef {
  path: string;
  prepend?: boolean;
}

export async function tsAddRef(referencers: Project[], referencees: Project[]) {
  const refs: tsProjectRef[] = referencees.map(ref => ({
    path: ref.rootDir,
  }));
  for (const referencer of referencers) {
    const tsconfigDir = join(referencer.rootDirRealPath, "tsconfig.json");
    const tsconfig = await readJSON(tsconfigDir);
    if (!(tsconfig.references instanceof Array)) tsconfig.references = [];
    (tsconfig.references as tsProjectRef[]).push(...refs);
    await writeJSON(tsconfigDir, tsconfig);
  }
}
