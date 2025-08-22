import type { WorkspaceFilter } from "@pnpm/filter-workspace-packages";

export function globsToPnpmFilters(
  globs?: string[],
  prodGlobs?: string[],
): WorkspaceFilter[] {
  let filters: WorkspaceFilter[] = [];
  let prodFilters: WorkspaceFilter[] = [];
  if (globs)
    filters = globs.map(glob => ({
      filter: glob,
      followProdDepsOnly: false,
    }));
  if (prodGlobs)
    prodFilters = prodGlobs.map(glob => ({
      filter: glob,
      followProdDepsOnly: true,
    }));
  return filters.push(...prodFilters);
}
