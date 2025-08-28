import { filterPackagesFromDir } from "@pnpm/filter-workspace-packages";
import { globsToPnpmFilters } from "./globsToPnpmFilters.js";

/** The [0] is common globs, the [1] is production globs */
export type PnpmGlobs = [string[] | undefined, string[] | undefined];

export function globPkgFromDir(workspaceDir: string, globs: PnpmGlobs) {
  return filterPackagesFromDir(workspaceDir, globsToPnpmFilters(...globs), {
    prefix: "",
    workspaceDir,
    useGlobDirFiltering: true,
  });
}
