import type { CommandModule } from "yargs";

interface ArgvType {
  depend: string[];
  filter?: string[];
  "filter-prod"?: string[];
  "no-pm"?: boolean;
}

const forbidden = [
  "g",
  "global",
  "test-pattern",
  "changed-files-ignore-pattern",
];
const removals = ["ts-eliminate-dep-in-mono", "tedim"];

const command: CommandModule<{}, ArgvType> = {
  command: "ts-add-dep-in-mono <depend...>",
  aliases: ["tadim", ...removals],
  describe:
    "To a ts subpackage in your monorepo, add or eliminate/remove anonther one as a dependency and update tsconfig reference",
  builder(yargs) {
    forbidden.forEach(flag => yargs.deprecateOption(flag, `No flag ${flag}`));
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
      .option("no-pm", {
        describe: "Only alter tsconfig references, don't exec package manager",
        type: "boolean",
      })
      .check(argv => {
        if (!(argv.filter || argv["filter-prod"]))
          throw new Error("Missing filter");
        return true;
      })
      .strict(false);
  },
  async handler(argv) {
    const { globPkgFromDir } = await import("../lib/filterPkgInMono.js");
    const { tsAlterRef } = await import("../lib/tsAlterRef.js");
    const { spawnSync } = await import("child_process");
    const { hideBin } = await import("yargs/helpers");

    const act = removals.includes(argv._[0] as string) ? "remove" : "add";
    const workspaceDir = ".";
    const referencers = await globPkgFromDir(workspaceDir, [
      argv.filter,
      argv["filter-prod"],
    ]);
    const referencees = await globPkgFromDir(workspaceDir, [
      argv.depend,
      undefined,
    ]);
    await tsAlterRef(referencers.allProjects, referencees.allProjects, {
      action: act,
    });

    if (!argv["no-pm"])
      spawnSync("pnpm", [act, ...hideBin(process.argv)], {
        stdio: "inherit",
      });
  },
};

export default command;
