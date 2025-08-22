import type { CommandModule } from "yargs";
import { hideBin } from "yargs/helpers";

interface ArgvType {
  depend: string[];
  filter?: string[];
  "filter-prod"?: string[];
}

const forbidden = [
  "g",
  "global",
  "test-pattern",
  "changed-files-ignore-pattern",
];

const command: CommandModule<{}, ArgvType> = {
  command: "ts-add-dep-in-mono <depend...>",
  aliases: "tadim",
  describe:
    "To a ts subpackage in your monorepo, add anonther one as a dependency and update tsconfig reference",
  builder(yargs) {
    forbidden.forEach((flag) => yargs.deprecateOption(flag, `No flag ${flag}`));
    return yargs
      .positional("depend", {
        describe: "Dependencies to add",
        type: "string",
        array: true,
        demandOption: true,
      })
      .option("filter", {
        alias: "F",
        describe: "Filter pattern",
        type: "string",
        array: true,
      })
      .option("filter-prod", {
        describe: "Prod filter pattern",
        type: "string",
        array: true,
      })
      .check((argv) => {
        if (!(argv.filter || argv["filter-prod"]))
          throw new Error("Missing filter");
        return true;
      })
      .strict(false);
  },
  async handler(argv) {
    const { globPkgFromDir } = await import("../lib/filterPkgInMono.js");
    const { tsAddRef } = await import("../lib/tsAddRef.js");
    const { spawnSync } = await import("child_process");

    const workspaceDir = ".";
    const referencers = await globPkgFromDir(workspaceDir, [
      argv.filter,
      argv["filter-prod"],
    ]);
    const referencees = await globPkgFromDir(workspaceDir, [
      argv.depend,
      undefined,
    ]);
    await tsAddRef(referencers.allProjects, referencees.allProjects);
    spawnSync("pnpm", ["add", ...hideBin(process.argv)], { stdio: "inherit" });
  },
};

export default command;
