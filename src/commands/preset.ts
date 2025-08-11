import { readdir } from "node:fs/promises";
import { join } from "node:path";
import type { CommandModule } from "yargs";

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
    const { copyPreset } = await import("../lib/preset.js");
    copyPreset(
      argv.presets ?? readdir(join(__dirname, "../../assets")),
      argv.dest,
    );
  },
};

export default command;
