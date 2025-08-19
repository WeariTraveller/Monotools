import { readdir } from "node:fs/promises";
import { join } from "node:path";
import type { CommandModule } from "yargs";
import { assetsDir } from "../const.js";

interface Argv {
  presets?: string[];
  dest: string;
}

const command: CommandModule<{}, Argv> = {
  command: "preset [presets..]",
  describe: "Generate (specific) presets in your workspace",
  builder(yargs) {
    return yargs
      .positional("presets", {
        describe: "Names of presets that need generating",
        type: "string",
        array: true,
        demandOption: false,
      })
      .option("dest", {
        alias: "d",
        describe: "Where to generate presets",
        type: "string",
        default: ".",
      });
  },
  async handler(argv) {
    const { copy } = await import("../service/informativeCopy.js");
    for (const preset of argv.presets ?? (await readdir(assetsDir))) {
      const src = join(assetsDir, preset);
      const target = join(argv.dest, preset);
      copy(src, target, { overwrite: false });
    }
  },
};

export default command;
